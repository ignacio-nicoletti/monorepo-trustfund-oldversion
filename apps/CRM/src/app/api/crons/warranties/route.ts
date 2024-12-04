import { NextRequest, NextResponse } from "next/server";
import db, {
  warranties,
  expiredWarranties,
  expiredWarrantyToWarrantor,
  warrantors,
  datePeriods,
  quotas,
  documents,
  addresses,
  urlSign,
  eq,
  and,
  sql,
} from "@repo/database/db";
import type { WarrantiesWithoutDebt, WarrantorsDatum } from "./types";

// ! 4. Si se inserta y actualizan las referencias correctamente en el paso anterior, proceder a borrar la garantia.
// ! 5. Si se borra correctamente responder OK, todo piola gato 🐈

export async function GET(req: NextRequest) {
  try {
    console.time("Checkeando garantias");
    const today = new Date().toISOString();
    const expiredWarrantiesWithoutDebt: WarrantiesWithoutDebt = [];

    // ! 1. Tomar todas las garantias activas (cerradas ganadas: statusId = 7):
    // ! 2.  Chequear la vigencia de la garantias (datePeriods: contractEndDate)
    const warrantiesToCheck = await db
      .select({
        warranty: warranties,
        expiration: datePeriods.endDate,
      })
      .from(warranties)
      .leftJoin(datePeriods, eq(warranties.datePeriodId, datePeriods.id))
      .leftJoin(addresses, eq(warranties.addressId, addresses.id))
      .where(
        and(
          eq(warranties.statusWarrantyId, 7),
          sql`${datePeriods.endDate} < ${today}`
        )
      );

    if (warrantiesToCheck.length > 0) {
      // ! 2.a Chequear que las cuotas esten todas pagas
      for (const { warranty } of warrantiesToCheck) {
        const quotasToCheck = await db.query.quotas.findMany({
          where: eq(quotas.warrantyId, warranty.id),
        });

        const arePaid = quotasToCheck.every((quota) => quota.status === "Pago");

        // ! 2.b Si estan pagas, pedimos el restos de los modelos asociados
        if (arePaid) {
          // Paso 2.b: Obtener documentos y garantes asociados
          const documentsToUpdate = await db.query.documents.findMany({
            where: eq(documents.warrantyId, warranty.id),
          });

          const warrantorsToUpdate = await db
            .select()
            .from(warrantors)
            .where(eq(warrantors.warrantyId, warranty.id));

          const warrantorsData: WarrantorsDatum[] = await Promise.all(
            warrantorsToUpdate.map(async (elem) => {
              const warrantorDocs = await db.query.documents.findMany({
                where: eq(documents.warrantorId, elem.id),
              });
              const warrantorUrls = await db.query.urlSign.findMany({
                where: eq(urlSign.warrantorId, elem.id),
              });

              // Construir los datos completos solo si hay información relevante
              if (warrantorDocs.length > 0 || warrantorUrls.length > 0) {
                return {
                  ...elem,
                  documents: warrantorDocs,
                  urlSign: warrantorUrls,
                };
              }
              return elem;
            })
          );

          // Agregar la garantía sin deuda a la lista final
          expiredWarrantiesWithoutDebt.push({
            ...warranty,
            quotasData: quotasToCheck,
            documentsData: documentsToUpdate,
            warrantorsData,
          });
        }
      }

      // ! 2.c. Si no hay garantias con cuotas respondemos 404, gato 🐈
      if (expiredWarrantiesWithoutDebt.length === 0) {
        return NextResponse.json("No hay garantías en condiciones de expirar", {
          status: 404,
        });
      } else {
        // ! 3. Si se cumple que ya no esta vigente y no tiene deuda:
        //    ! 3.a. Insertar en tabla ExpiredWarranties: data de la garantia y todos los datos asociados necesarios.
        //    ! 3.b. Limpiar warrantyId, folderName, driveFolderId y pasar el availability a true en el garante.
        //    ! 3.c. Una vez insertado actualizar las referencias (warrantyId --> expiredWarrantyId) y el resto de las FK:
        //        ! 3.c.I datePeriods
        //        ! 3.c.II quotas
        //        ! 3.c.III warranty.documents
        //        ! 3.c.IV warrantors

        const transaction = await db.transaction(async (tx) => {
          let expiredWarrantiesCreated = [];

          for (const expiredWarranty of expiredWarrantiesWithoutDebt) {
            let {
              documentsData,
              quotasData,
              warrantorsData,
              id,
              ...warrantyData
            } = expiredWarranty;

            const newExpiredWarranty = await tx
              .insert(expiredWarranties)
              .values({ ...warrantyData })
              .returning();

            if (newExpiredWarranty[0]?.id) {
              if (quotasData?.length) {
                for (const quota of quotasData) {
                  const updatedQuota = await tx
                    .update(quotas)
                    .set({
                      warrantyId: null,
                      expiredWarrantyId: newExpiredWarranty[0].id,
                    })
                    .where(eq(quotas.id, quota.id))
                    .returning();

                  if (!updatedQuota[0]?.id) {
                    continue;
                  }
                }
              }

              if (documentsData?.length) {
                for (const doc of documentsData) {
                  const updatedDoc = await tx
                    .update(documents)
                    .set({
                      warrantyId: null,
                      expiredWarrantyId: newExpiredWarranty[0].id,
                    })
                    .where(eq(documents.id, doc.id))
                    .returning();

                  if (!updatedDoc[0]?.id) {
                    continue;
                  }
                }
              }

              if (warrantorsData?.length) {
                for (const warrantor of warrantorsData) {
                  const newWarratorToExpiredWarranty = await tx
                    .insert(expiredWarrantyToWarrantor)
                    .values({
                      warrantorId: warrantor.id,
                      expiredWarrantyId: newExpiredWarranty[0].id,
                    })
                    .returning();

                  if (!newWarratorToExpiredWarranty[0]?.warrantorId) {
                    continue;
                  }

                  const updatedWarrantor = await tx
                    .update(warrantors)
                    .set({
                      warrantyId: null,
                      driveFolderId: null,
                      folderName: null,
                      availability: true,
                    })
                    .where(eq(warrantors.id, warrantor.id))
                    .returning();

                  if (!updatedWarrantor[0]?.id) {
                    continue;
                  }

                  if (warrantor.documents?.length) {
                    for (const doc of warrantor.documents) {
                      const updatedWarrantorDoc = await tx
                        .update(documents)
                        .set({
                          warrantorId: null,
                          expiredWarrantyId: newExpiredWarranty[0].id,
                        })
                        .where(eq(documents.id, doc.id))
                        .returning();

                      if (!updatedWarrantorDoc[0]?.id) {
                        continue;
                      }
                    }
                  }
                  if (warrantor.urlSign?.length) {
                    for (const url of warrantor.urlSign) {
                      const updatedWarrantorUrl = await tx
                        .update(urlSign)
                        .set({
                          warrantorId: null,
                          expiredWarrantyId: newExpiredWarranty[0].id,
                        })
                        .where(eq(urlSign.id, url.id))
                        .returning();

                      if (!updatedWarrantorUrl[0]?.id) {
                        continue;
                      }
                    }
                  }
                }
              }

              let deletedWarranty = await tx
                .delete(warranties)
                .where(eq(warranties.id, id))
                .returning();

              if (deletedWarranty[0]?.id) {
                expiredWarrantiesCreated.push(newExpiredWarranty[0]);
              } else {
                continue;
              }
            } else {
              continue;
            }
          }

          if (expiredWarrantiesCreated?.length) {
            return NextResponse.json("Se procesaron las garantías", {
              status: 200,
            });
          } else {
            return NextResponse.json("Falló al checkear las garantías", {
              status: 500,
              statusText: "Internal server error",
            });
          }
        });
        console.timeEnd("Checkeando garantias");
        return transaction;
      }
    } else {
      console.timeEnd("Checkeando garantias");
      return NextResponse.json("No hay garantias para modificar", {
        status: 404,
        statusText: "Not found.",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
      statusText: "Internal server error",
    });
  }
}

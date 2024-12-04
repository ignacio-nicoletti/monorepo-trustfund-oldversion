import db, {
  addresses,
  and,
  coverageTypes,
  currencyTypes,
  datePeriods,
  documents,
  dollarTypes,
  eq,
  financingTypes,
  inmobiliarias,
  quotas,
  sql,
  statusWarranty,
  urlSign,
  users,
  warranties,
  warrantors,
  warrantyTypes,
} from "@repo/database/db";
import { InferDocument, InferUrlSign } from "@repo/database/types";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";
import { WarrantyDetails } from "~/src/components/forms/UploadWarrantyForm/WarrantyDetails/types/warrantyForm.types";
import { months } from "~/src/utils/month";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let warrantyWithRelations: any = await db
      .select()
      .from(warranties)
      .where(eq(warranties.id, params.id))
      .leftJoin(users, eq(warranties.userId, users.id))
      .leftJoin(addresses, eq(warranties.addressId, addresses.id))
      .leftJoin(statusWarranty, eq(warranties.statusWarrantyId, statusWarranty.id))
      .leftJoin(currencyTypes, eq(warranties.currencyTypeId, currencyTypes.id))
      .leftJoin(dollarTypes, eq(warranties.dollarTypeId, dollarTypes.id))
      .leftJoin(financingTypes, eq(warranties.financingTypeId, financingTypes.id))
      .leftJoin(warrantyTypes, eq(warranties.warrantyTypeId, warrantyTypes.id))
      .leftJoin(datePeriods, eq(warranties.datePeriodId, datePeriods.id))
      .leftJoin(coverageTypes, eq(warranties.coverageTypeId, coverageTypes.id));

    if (warrantyWithRelations[0]?.warranties?.inmobiliariaId) {
      let inmoWithAddress = await db
        .select()
        .from(inmobiliarias)
        .where(eq(inmobiliarias.id, warrantyWithRelations[0]?.warranties?.inmobiliariaId))
        .leftJoin(addresses, eq(addresses.id, inmobiliarias.addressId));

      warrantyWithRelations[0].inmobiliarias = inmoWithAddress?.length
        ? {
            ...inmoWithAddress[0]?.inmobiliarias,
            addresses: inmoWithAddress[0]?.addresses,
          }
        : null;
    }

    // quotas para la garantía
    const quotassss = await db.query.quotas.findMany({
      where: eq(quotas.warrantyId, params.id),
    });

    if (quotassss?.length) {
      warrantyWithRelations = [
        {
          ...warrantyWithRelations[0],
          quotas: quotassss,
        },
      ];
    }

    // documentos para las garantías
    const docs = await db.query.documents.findMany({
      where: eq(documents.warrantyId, params.id),
    });

    if (docs?.length) {
      const warrantyDocumentTypes = await db.query.warrantyDocumentTypes.findMany({
        columns: {
          createdAt: false,
          updatedAt: false,
        },
      });

      const documentsData = docs.map((doc) => {
        // Find the document type for the current document
        const documentType = warrantyDocumentTypes.find((type) => type.id === doc.warrantyDocumentTypesId);

        // Return the document with its associated type
        return {
          ...doc,
          documentType,
        };
      });

      warrantyWithRelations = [
        {
          ...warrantyWithRelations[0],
          warranties: {
            ...warrantyWithRelations[0].warranties,
            documentsData,
          },
        },
      ];
    }

    if (warrantyWithRelations[0]?.addresses?.number) {
      warrantyWithRelations = [
        {
          ...warrantyWithRelations[0],
          addresses: {
            ...warrantyWithRelations[0].addresses,
            number: warrantyWithRelations[0].addresses.number.toString(),
          },
        },
      ];
    }

    let warrantorsWithRelations = await db
      .select({
        id: warrantors.id,
        name: warrantors.name,
        lastname: warrantors.lastname,
        email: warrantors.email,
        phone: warrantors.phone,
        dni: warrantors.dni,
        nacionality: warrantors.nacionality,
        addressId: warrantors.addressId,
        province: addresses.province,
        city: addresses.city,
        street: addresses.street,
        intersectionOne: addresses.intersectionOne,
        intersectionTwo: addresses.intersectionTwo,
        number: addresses.number,
        isRequester: warrantors.isRequester,
        isOwner: warrantors.isOwner,
        driveFolderId: warrantors.driveFolderId,
        folderName: warrantors.folderName,
        postal_code: addresses.postalCode,
      })
      .from(warrantors)
      .where(eq(warrantors.warrantyId, params.id))
      .leftJoin(addresses, eq(warrantors.addressId, addresses.id));

    if (warrantorsWithRelations?.length) {
      warrantorsWithRelations = await Promise.all(
        warrantorsWithRelations.map(async (elem) => {
          let urls: InferUrlSign[] = await db.query.urlSign.findMany({
            where: eq(urlSign.warrantorId, elem.id),
          });

          let docs: InferDocument[] = await db.query.documents.findMany({
            where: eq(documents.warrantorId, elem.id),
          });

          if (urls?.length || docs?.length) {
            return {
              ...elem,
              urlSign: urls,
              documentsData: docs,
            };
          } else {
            return elem;
          }
        })
      );
    }
    //Acomodar a solicitante en la poscion 1 y el propietario en la posicion 2 del array
    const warrantorsWithRelationsOrdered = [
      ...(warrantorsWithRelations.find((user) => user.isRequester === true)
        ? [warrantorsWithRelations.find((user) => user.isRequester === true)]
        : []), // Usuario "solicitante" si existe
      ...(warrantorsWithRelations.find((user) => user.isOwner === true)
        ? [warrantorsWithRelations.find((user) => user.isOwner === true)]
        : []), // Usuario "propietario" si existe
      ...warrantorsWithRelations.filter(
        (user) => !user.isRequester && !user.isOwner // Resto de los usuarios
      ),
    ].filter(Boolean);

    // Retornas el array ya ordenado en la respuesta
    if (warrantyWithRelations[0]?.warranties?.id) {
      return NextResponse.json({
        warrantyWithRelations: warrantyWithRelations[0],
        warrantorsWithRelations: warrantorsWithRelationsOrdered,
      });
    } else {
      return NextResponse.json("No existe garantía creada", {
        status: 404,
        statusText: "Not Found",
      });
    }
  } catch (error: any) {
    console.error("Error in GET /warranties  by id:", error);
    return NextResponse.json({ message: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}

//! FALTA FIXEAR EL UPDATE atte. Mica alias Camarón
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedData: WarrantyDetails = await request.json(); // Datos enviados en la solicitud
    const warrantyId = params.id;
    const monthStr = updatedData?.reservationDate ? months[new Date(updatedData.reservationDate).getMonth()] : null;

    const transaction = await db.transaction(async (tx) => {
      // Busco al solicitante
      let requester = await tx
        .select({
          id: warrantors.id,
          driveFolderId: warrantors.driveFolderId,
          folderName: warrantors.folderName,
          isRequester: warrantors.isRequester,
          warrantyId: warrantors.warrantyId,
        })
        .from(warrantors)
        .where(and(eq(warrantors.warrantyId, warrantyId), eq(warrantors.isRequester, true)));

      // Upsert de la garantía
      const warrantyToUpdate = await tx.select().from(warranties).where(eq(warranties.id, warrantyId));

      if (!warrantyToUpdate[0]) {
        return NextResponse.json("Garantía no encontrada", {
          status: 404,
          statusText: "Not Found",
        });
      }

      // Upsert de la dirección
      const datePeriodId = warrantyToUpdate[0].datePeriodId;

      const updatedDatePeriod = await tx
        .insert(datePeriods)
        .values({
          id: datePeriodId || undefined,
          startDate: updatedData.contractInitDate,
          endDate: updatedData.contractEndDate,
        })
        .onConflictDoUpdate({
          target: datePeriods.id,
          set: {
            startDate: updatedData.contractInitDate,
            endDate: updatedData.contractEndDate,
            updatedAt: new Date().toISOString(),
          },
        })
        .returning();

      if (!updatedDatePeriod[0]) {
        return NextResponse.json("Error al crear o actualizar la duracion del contrato", {
          status: 400,
          statusText: "Bad Request",
        });
      }

      // Upsert de la dirección
      const addressId = warrantyToUpdate[0].addressId;

      const updatedAddress = await tx
        .insert(addresses)
        .values({
          id: addressId || undefined,
          street: updatedData.street,
          number: Number(updatedData.number),
          intersectionOne: updatedData.intersectionOne,
          intersectionTwo: updatedData.intersectionTwo,
          province: updatedData.province,
          city: updatedData.city,
          postalCode: updatedData.postal_code,
        })
        .onConflictDoUpdate({
          target: addresses.id,
          set: {
            street: updatedData.street,
            number: Number(updatedData.number),
            intersectionOne: updatedData.intersectionOne,
            intersectionTwo: updatedData.intersectionTwo,
            province: updatedData.province,
            city: updatedData.city,
            postalCode: updatedData.postal_code,
          },
        })
        .returning();

      if (!updatedAddress[0]) {
        return NextResponse.json("Error al crear o actualizar la dirección", {
          status: 400,
          statusText: "Bad Request",
        });
      }

      const quota = [];

      if (updatedData.quotas) {
        // Get existing quotas for the given warrantyId
        const quotasToUpdate = await tx.query.quotas.findMany({
          where: eq(quotas.warrantyId, warrantyId),
        });

        // Loop through updatedData.quotas
        for (let cuota of updatedData.quotas) {
          // Check if the quota already exists based on numberOfQuota and warrantyId
          const existingQuota = quotasToUpdate.find((q) => q.numberOfQuota === cuota.numberOfQuota);

          let quotaDriveFolderId = existingQuota?.driveFolderId
            ? existingQuota.driveFolderId
            : requester[0]?.driveFolderId
              ? requester[0].driveFolderId
              : null;
          let quotaFolderName = existingQuota?.folderName
            ? existingQuota.folderName
            : requester[0]?.folderName
              ? requester[0].folderName
              : null;

          const monthStr = months[new Date(cuota.expiration!).getMonth()];
          const updatedCuota = await tx
            .insert(quotas)
            .values({
              id: existingQuota?.id,
              amount: cuota.amount,
              numberOfQuota: cuota.numberOfQuota,
              expiration: cuota.expiration,
              status: cuota.status,
              paidPreviously: cuota.paidPreviously,
              month: monthStr,
              folderName: quotaFolderName,
              driveFolderId: quotaDriveFolderId,
              warrantyId: warrantyId,
            })
            .onConflictDoUpdate({
              target: quotas.id, // Use unique key like quotas.id if available, or a composite key like (numberOfQuota, warrantyId)
              set: {
                amount: cuota.amount,
                expiration: cuota.expiration,
                status: cuota.status,
                paidPreviously: cuota.paidPreviously,
                month: monthStr,
                folderName: quotaFolderName,
                driveFolderId: quotaDriveFolderId,
                warrantyId: warrantyId,
              },
            })
            .returning();

          if (!updatedCuota[0]) {
            return NextResponse.json("Error al crear o actualizar la cuota", {
              status: 400,
              statusText: "Bad Request",
            });
          }

          // Push the updated/created cuota to the quota array
          quota.push(updatedCuota[0]);
        }
      }

      const updatedWarranty = await tx
        .update(warranties)
        .set({
          addressId: updatedAddress[0].id,
          datePeriodId: updatedDatePeriod[0].id,
          financingTypeId: updatedData.financingTypeId
            ? Number(updatedData.financingTypeId)
            : warrantyToUpdate[0].financingTypeId,
          currencyTypeId: updatedData?.currencyTypeId
            ? Number(updatedData.currencyTypeId)
            : warrantyToUpdate[0].currencyTypeId,
          dollarTypeId: updatedData?.dollarTypeId ? Number(updatedData.dollarTypeId) : warrantyToUpdate[0].dollarTypeId,
          warrantyTypeId: updatedData.warrantyTypeId
            ? Number(updatedData.warrantyTypeId)
            : warrantyToUpdate[0].warrantyTypeId,
          coverageTypeId: updatedData.coverageTypeId
            ? Number(updatedData.coverageTypeId)
            : warrantyToUpdate[0].coverageTypeId,
          reservationDate: updatedData.reservationDate
            ? new Date(updatedData.reservationDate).toISOString()
            : warrantyToUpdate[0].reservationDate,
          contractDuration: updatedData.contractDuration
            ? updatedData.contractDuration
            : warrantyToUpdate[0].contractDuration,
          warrantyAmount: updatedData.warrantyAmount
            ? Number(updatedData.warrantyAmount)
            : warrantyToUpdate[0].warrantyAmount,
          reservationAmount: updatedData.reservationAmount
            ? Number(updatedData.reservationAmount)
            : warrantyToUpdate[0].reservationAmount,
          warrantyAmountLessReservation: Number(updatedData?.warrantyAmount) - Number(updatedData?.reservationAmount),
          month: monthStr,
        })
        .where(eq(warranties.id, params.id))
        .returning();

      if (!updatedWarranty[0]) {
        return NextResponse.json("Error al crear o actualizar la garantía", {
          status: 400,
          statusText: "Bad Request",
        });
      }

      return {
        updatedQuotas: quota,
        updatedDatePeriod: updatedDatePeriod[0],
        updatedAddress: updatedAddress[0],
        updatedWarranty: updatedWarranty[0],
      };
    });

    return NextResponse.json(transaction, {
      status: 201,
      statusText: "Created",
    });
  } catch (error: any) {
    console.error(`Error in PUT /warranties/${params.id}:`, error);
    return NextResponse.json(`An unexpected error occurred. ${error.message}`, {
      status: 500,
      statusText: "Internal server error",
    });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const warrantyId = params.id;
    const { userId, statusId, realStateId } = await request.json();

    if (!warrantyId || !statusId) {
      return NextResponse.json({ message: "ID y statusId son requeridos." }, { status: 400 });
    }

    //Datos de la garantia
    const warrantyData = await db.query.warranties.findFirst({
      where: eq(warranties.id, warrantyId),
    });

    if (!warrantyData) {
      return NextResponse.json({ message: `No se encontró la garantía con este ID: ${warrantyId}.` }, { status: 404 });
    }

    //Datos de la inmo
    const inmobiliariaData = await db.query.inmobiliarias.findFirst({
      where: eq(inmobiliarias.id, realStateId),
    });

    //Datos del user
    const userData = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    //Datos de los garantes
    const warrantorData = await db.query.warrantors.findFirst({
      where: and(
        eq(warrantors.warrantyId, warrantyId),
        eq(warrantors.availability, false),
        eq(warrantors.isRequester, true)
      ),
    });

    //Caso del estado de la garantia ganada
    if (statusId === 7) {
      if (!userData?.id) return NextResponse.json("Usuario no encontrado", { status: 404 });

      const transaction = await db.transaction(async (tx) => {
        const updatedUser = await tx
          .update(users)
          .set({
            warrantiesInProcess: userData!.warrantiesInProcess - 1 < 0 ? 0 : userData!.warrantiesInProcess - 1,
            warrantiesWon: userData!.warrantiesWon + 1,
          })
          .where(eq(users.id, userId))
          .returning();

        if (!updatedUser[0]?.id) {
          throw new Error("Error: No se pudo modificar los contadores del usuario e inmobiliaria");
        }

        if (inmobiliariaData?.id) {
          const updatedRealEstate = await tx
            .update(inmobiliarias)
            .set({
              warrantiesInProcess:
                inmobiliariaData!.warrantiesInProcess - 1 < 0 ? 0 : inmobiliariaData!.warrantiesInProcess - 1,
              warrantiesWon: inmobiliariaData!.warrantiesLost + 1,
            })
            .where(eq(inmobiliarias.id, realStateId))
            .returning();

          if (!updatedRealEstate[0]?.id) {
            throw new Error("Error: No se pudo modificar los contadores del usuario, garante e inmobiliaria");
          } else {
            if (warrantyData?.reservationDate) {
              const updatedWarranty = await tx
                .update(warranties)
                .set({ statusWarrantyId: statusId })
                .where(eq(warranties.id, warrantyId))
                .returning();
      
              return updatedWarranty[0]?.id ? true : false;
            } else {
              return false
            }
          }
        } else {
          throw new Error("Error: Inmobiliaria no encontrada");
        }
      });

      if (transaction) {
        return NextResponse.json(
          {
            messege: "Garantia - usuario - inmobiliaria actualizada correctamente",
            confettiNice: true,
            confettiBad: false,
          },
          {
            status: 201,
          }
        );
      } else {
        return NextResponse.json("Garantia - usuario - inmobiliaria error al actualizar", {
          status: 400,
        });
      }
    } else if (statusId === 8) {
      if (!userData?.id) return NextResponse.json("Usuario no encontrado", { status: 404 });
      // * PREGUNTAR SI LO CHEQUEAMOS O NO 
      // if (!warrantorData?.id) return NextResponse.json("Garante no encontrado", { status: 404 });

      const transaction = await db.transaction(async (tx) => {
        const updatedUser = await tx
          .update(users)
          .set({
            warrantiesInProcess: userData!.warrantiesInProcess - 1 < 0 ? 0 : userData!.warrantiesInProcess - 1,
            warrantiesLost: userData!.warrantiesLost + 1,
          })
          .where(eq(users.id, userId))
          .returning();

        const updatedWarrantor = await tx
          .update(warrantors)
          .set({
            availability: true,
            driveFolderId: null,
            folderName: null,
          })
          .where(eq(warrantors.warrantyId, warrantyId))
          .returning();

        if (!updatedUser[0]?.id && !updatedWarrantor[0]?.id) {
          throw new Error("Error: No se pudo modificar los contadores del usuario, garante e inmobiliaria");
        }

        if (inmobiliariaData?.id) {
          const updatedRealEstate = await tx
            .update(inmobiliarias)
            .set({
              warrantiesInProcess:
                inmobiliariaData!.warrantiesInProcess - 1 < 0 ? 0 : inmobiliariaData!.warrantiesInProcess - 1,
              warrantiesLost: inmobiliariaData!.warrantiesLost + 1,
            })
            .where(eq(inmobiliarias.id, realStateId))
            .returning();

          if (!updatedRealEstate[0]?.id) {
            throw new Error("Error: No se pudo modificar los contadores del usuario, garante e inmobiliaria");
          }
        } 

        const updatedWarranty = await tx
          .update(warranties)
          .set({ statusWarrantyId: statusId })
          .where(eq(warranties.id, warrantyId))
          .returning();

        return updatedWarranty[0]?.id ? true : false;
      });

      if (transaction) {
        return NextResponse.json(
          {
            messege: "Garantia - usuario - inmobiliaria actualizada correctamente",
            confettiNice: false,
            confettiBad: true,
          },
          {
            status: 201,
          }
        );
      } else {
        return NextResponse.json("Garantia - usuario - inmobiliaria error al actualizar", {
          status: 400,
        });
      }
    } else {
      const updatedWarranty = await db
        .update(warranties)
        .set({ statusWarrantyId: statusId })
        .where(eq(warranties.id, warrantyId))
        .returning();

      if (updatedWarranty[0]?.id) {
        return NextResponse.json("Garantía actualizada exitosamente.", {
          status: 201,
        });
      } else {
        return NextResponse.json("No se pudo actualizar la garantía.", {
          status: 400,
        });
      }
    }
  } catch (error: any) {
    console.error("Error algo salió mal:", error);
    return NextResponse.json({ message: error.message || "Ocurrió un error inesperado." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Elimina primero los datos relacionados con la garantía
  // 1 - garantes buscar (con warrantiID) y borrar sus documentos - url y la direccion *
  // 2 - se borra el/los garante *
  // 3 - documentos de la garantia*
  // 4 - eliminar cuotas de la garantia*
  // 5 - eliminar la garantía, este va hacer el ultimo paso. *
  // 6 - adrres de la garantia*
  // 7 - Descontar 1 garantia alresponsable
  const warrantyId = params.id;

  if (!warrantyId) {
    console.error("Warranty ID is required.");
    return NextResponse.json({ message: "Warranty ID is required." }, { status: 400, statusText: "Bad Request" });
  }
  try {
    // console.log(`Starting transaction for warranty ID: ${warrantyId}`);

    await db.transaction(async (tx) => {
      const warrantorsData = await tx
        .select()
        .from(warrantors)
        .where(eq(warrantors.warrantyId, warrantyId))
        .leftJoin(addresses, eq(addresses.id, warrantors.addressId));

      if (!warrantorsData.length) {
        console.error("No existen warrantors asociados a la garantía.");
        // throw new Error("No existen warrantors asociados a la garantía.");
      } else {
        // Elimina documentos de warrantors
        await Promise.all(
          warrantorsData.map(async (warrantor) => {
            // console.log(`Deleting documents for warrantor ID: ${warrantor.warrantors.id}`);

            // Paso 1: Eliminar documentos de warrantors asociados
            await tx.delete(documents).where(eq(documents.warrantorId, warrantor.warrantors.id));

            // console.log(`Deleted documents for warrantor ID ${warrantor.warrantors.id}:`,deletedUserDocs );
            await tx.delete(urlSign).where(eq(urlSign.warrantorId, warrantor.warrantors.id));
            // console.log(`Deleted URL sign for warrantor ID ${warrantor.warrantors.id}:`,deletedUserUrl);
          })
        );

        // Paso 2: Eliminar documentos y URL de warrantors
        await Promise.all(
          warrantorsData.map(async (warrantor) => {
            // segun nacho ya llegan eliminadas cuando el estado esta en CERRADA PERDIDA
            // await tx
            //   .delete(documents)
            //   .where(eq(documents.warrantorId, warrantor.warrantors.id));
            await tx.delete(urlSign).where(eq(urlSign.warrantorId, warrantor.warrantors.id));
          })
        );

        // Paso 3: Eliminar warrantors
        await tx.delete(warrantors).where(eq(warrantors.warrantyId, warrantyId));

        // Paso 4: Eliminar las direcciones asociadas a los warrantors, si existen
        await Promise.all(
          warrantorsData.map(async (warrantor) => {
            if (warrantor.addresses && warrantor.addresses.id) {
              await tx.delete(addresses).where(eq(addresses.id, warrantor.addresses.id));
            }
          })
        );
      }
      // Obtener datos de la garantía
      const warrantyData = await tx.select().from(warranties).where(eq(warranties.id, warrantyId));

      if (!warrantyData.length) {
        throw new Error("La garantía no existe.");
      }

      const warranty = warrantyData[0];

      // Eliminar cuotas de la garantía
      await tx.delete(quotas).where(eq(quotas.warrantyId, warrantyId));

      // Eliminar la garantía
      const deletedWarranty = await tx.delete(warranties).where(eq(warranties.id, warrantyId));
      if (!deletedWarranty) throw new Error("Error al eliminar la garantía.");

      // Actualizar warrantiesLost del usuario
      if (warranty?.userId) {
        await tx
          .update(users)
          .set({
            warrantiesLost: sql`${users.warrantiesLost} - 1`,
          })
          .where(eq(users.id, warranty.userId));
      }
      // Actualizar warrantiesLost de la garantia
      if (warranty?.inmobiliariaId) {
        await tx
          .update(inmobiliarias)
          .set({
            warrantiesLost: sql`${inmobiliarias.warrantiesLost} - 1`,
          })
          .where(eq(inmobiliarias.id, warranty.inmobiliariaId));
      }

      // Eliminar dirección de la garantía
      if (warranty?.addressId) {
        await tx.delete(addresses).where(eq(addresses.id, warranty.addressId));
      }
    });
    return NextResponse.json({ message: "Garantía y datos relacionados eliminados exitosamente." }, { status: 200 });
  } catch (error) {
    console.error(`Error en DELETE /warranties/${warrantyId}:`, error);
    return NextResponse.json(
      { message: `Ocurrió un error inesperado: ${error}` },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}

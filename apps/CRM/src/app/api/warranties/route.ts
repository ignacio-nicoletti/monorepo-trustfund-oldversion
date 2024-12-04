import { NextResponse, NextRequest } from "next/server";
import db, { addresses, datePeriods, documents, eq, users, warranties } from "@repo/database/db";

import { months } from "~/src/utils/month";

export async function POST(request: NextRequest) {
  try {
    let data = await request.json();
    let monthStr = data.reservationDate ? months[new Date(data?.reservationDate).getMonth()] : null;
    data = {
      ...data,
      warrantyAmount: data.warrantyAmount ? parseInt(data.warrantyAmount) : null,
      warrantyAmountLessReservation: data.warrantyAmountLessReservation
        ? parseInt(data.warrantyAmountLessReservation)
        : null,
      reservationAmount: data.reservationAmount ? parseInt(data.reservationAmount) : null,
      warrantyTypeId: data.warrantyTypeId ? parseInt(data.warrantyTypeId) : undefined,
      coverageTypeId: data.coverageTypeId ? parseInt(data.coverageTypeId) : undefined,
      financingTypeId: data.financingTypeId ? parseInt(data.financingTypeId) : undefined,
      currencyTypeId: data.currencyTypeId ? parseInt(data.currencyTypeId) : undefined,
      dollarTypeId: data.dollarTypeId ? parseInt(data.dollarTypeId) : undefined,
      statusWarrantyId: data.statusWarrantyId ? parseInt(data.statusWarrantyId) : 1,
    };

    // Iniciar la transacción
    const newWarrantySuccess = await db.transaction(async (tx) => {
      // Crear nueva dirección
      const userToUpdate = await tx.query.users.findFirst({
        where: eq(users.id, data.userId),
      });

      if (!userToUpdate) {
        return NextResponse.json("Usuario no encontrado", { status: 404, statusText: "Not found" });
      }

      const updatedUser = await tx
        .update(users)
        .set({
          warrantiesInProcess: (userToUpdate.warrantiesInProcess! += 1),
        })
        .where(eq(users.id, data.userId))
        .returning();

      if (!updatedUser[0]?.id) {
        return NextResponse.json("No se pudo actualizar al usuario", { status: 400, statusText: "Bad Request" });
      }

      let createdAddress = null;

      if (data?.province?.length && data?.street?.length && data.number) {
        createdAddress = await tx
          .insert(addresses)
          .values({
            country: data.country?.length ? data.country : "Argentina",
            province: data.province?.length ? data.province : null,
            city: data.city?.length ? data.city : null,
            street: data.street?.length ? data.street : null,
            intersectionOne: data.intersectionOne?.length ? data.intersectionOne : null,
            intersectionTwo: data.intersectionTwo?.length ? data.intersectionTwo : null,
            number: data.number ? Number(data.number) : null,
            postalCode: data.postal_code ? data.postal_code : null,
          })
          .returning();

        // Verificar que la dirección fue creada correctamente
        if (!createdAddress[0]?.id) {
          throw new Error("Error al crear address");
        }
      }

      const addressId = createdAddress ? createdAddress[0]?.id : undefined;

      // Crear nuevo datePeriod
      let createdDatePeriod = null;
      if (data?.contractEndDate?.length && data?.contractInitDate?.length) {
        createdDatePeriod = await tx
          .insert(datePeriods)
          .values({
            startDate: data.contractInitDate?.length ? data.contractInitDate : null,
            endDate: data.contractEndDate?.length ? data.contractEndDate : null,
          })
          .returning();
        // Verificar que la inmobiliaria fue creada
        if (!createdDatePeriod[0]?.id) {
          throw new Error("Error al crear datePeriod");
        }
      }

      const datePeriodId = createdDatePeriod ? createdDatePeriod[0]?.id : undefined;

      // Crear nuevo warranty
      const createdWarranty = await tx
        .insert(warranties)
        .values({
          contractDuration: data.contractDuration?.length ? data.contractDuration : null,
          warrantyAmount: data.warrantyAmount ? Number(data.warrantyAmount) : null,
          warrantyAmountLessReservation: data.warrantyAmountLessReservation
            ? Number(data.warrantyAmountLessReservation)
            : null,
          month: monthStr,
          reservationAmount: data.reservationAmount ? Number(data.reservationAmount) : null,
          reservationDate: data.reservationDate?.length ? data.reservationDate : null,
          warrantyTypeId: data.warrantyTypeId ? data.warrantyTypeId : undefined,
          coverageTypeId: data.coverageTypeId ? data.coverageTypeId : undefined,
          userId: data.userId?.length ? data.userId : undefined,
          financingTypeId: data.financingTypeId ? data.financingTypeId : undefined,
          inmobiliariaId: data.inmobiliariaId?.length ? data.inmobiliariaId : undefined,
          currencyTypeId: data.currencyTypeId ? data.currencyTypeId : undefined,
          dollarTypeId: data.dollarTypeId ? data.dollarTypeId : undefined,
          statusWarrantyId: data.statusWarrantyId ? data.statusWarrantyId : 1,
          datePeriodId: datePeriodId,
          addressId: addressId,
        })
        .returning();
      // Verificar que la inmobiliaria fue creada
      if (!createdWarranty[0]?.id) {
        throw new Error("Error al crear warranty");
      }

      data.documents &&
        data.documents.map(async (doc: any) => {
          return await tx
            .insert(documents)
            .values({
              warrantyDocumentTypesId: doc.type,
              url: doc.url,
              name: doc.name,
              warrantyId: createdWarranty[0]?.id,
            })

            .returning();
        });
      // Devolver true si todo fue exitoso

      return createdWarranty[0];
    });

    //@ts-ignore
    if (newWarrantySuccess?.id) {
      // Devolver los garantes creados

      return NextResponse.json(newWarrantySuccess, { status: 201 });
    } else {
      return NextResponse.json("No se pudo crear la garantía", { status: 400 });
    }

    // Si por alguna razón no se crea el usuario
  } catch (error: any) {
    console.error("Error in POST /warranties:", error);
    return NextResponse.json("An unexpected error occurred.", {
      status: 500,
    });
  }
}

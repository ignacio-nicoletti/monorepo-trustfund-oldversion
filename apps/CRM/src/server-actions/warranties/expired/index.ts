"use server";

import db, {
  addresses,
  coverageTypes,
  currencyTypes,
  datePeriods,
  dollarTypes,
  eq,
  financingTypes,
  inmobiliarias,
  statusWarranty,
  users,
  expiredWarranties,
  warrantyTypes,
  organizations,
} from "@repo/database/db";
export const getAllExpiredWarranties = async () => {
  try {
    const rawExpiredWarranties = await db
      .select({
        warranty: expiredWarranties,
        user: users,
        inmobiliaria: inmobiliarias,
        address: addresses,
        statusWarranty: statusWarranty,
        currencyType: currencyTypes,
        dollarType: dollarTypes.type,
        financingType: financingTypes,
        warrantyType: warrantyTypes,
        datePeriod: datePeriods,
        coverageType: coverageTypes,
        month: expiredWarranties.month,
        organization: organizations.type,
      })
      .from(expiredWarranties)
      .leftJoin(users, eq(expiredWarranties.userId, users.id))
      .leftJoin(organizations, eq(organizations.id, users.organizationId))
      .leftJoin(inmobiliarias, eq(inmobiliarias.id, expiredWarranties.inmobiliariaId))
      .leftJoin(addresses, eq(users.addressId, addresses.id))
      .leftJoin(statusWarranty, eq(expiredWarranties.statusWarrantyId, statusWarranty.id))
      .leftJoin(currencyTypes, eq(expiredWarranties.currencyTypeId, currencyTypes.id))
      .leftJoin(dollarTypes, eq(expiredWarranties.dollarTypeId, dollarTypes.id))
      .leftJoin(financingTypes, eq(expiredWarranties.financingTypeId, financingTypes.id))
      .leftJoin(warrantyTypes, eq(expiredWarranties.warrantyTypeId, warrantyTypes.id))
      .leftJoin(datePeriods, eq(expiredWarranties.datePeriodId, datePeriods.id))
      .leftJoin(coverageTypes, eq(expiredWarranties.coverageTypeId, coverageTypes.id));

    return rawExpiredWarranties?.length
      ? rawExpiredWarranties.map((expWarranty) => {
          return {
            id: expWarranty.warranty.id,
            responsableId: expWarranty.warranty.userId || null,
            reservationDate: expWarranty.warranty.reservationDate
              ? new Date(expWarranty.warranty.reservationDate!)
              : null,
            contractDuration: expWarranty.warranty.contractDuration || null,
            warrantyType: expWarranty.warrantyType?.type || null,
            responsable: expWarranty.user?.name + " " + expWarranty.user?.lastname || "No especificado",
            sucursal: expWarranty.address?.province || null,
            inmobiliaria: expWarranty.inmobiliaria?.name || null,
            coverageType: expWarranty.coverageType?.type || "",
            warrantyAmount: expWarranty.warranty.warrantyAmount || null,
            currency: expWarranty.currencyType?.type || "ARS",
            reservationAmount: expWarranty.warranty.reservationAmount || null,
            paymentMethod: expWarranty.financingType?.type || null,
            statusWarranty: "Finalizada",
            // requesterName: "-",
            organization: expWarranty.organization,
            month: expWarranty.warranty.month || null,
            year: new Date(expWarranty.warranty.reservationDate!).getFullYear() || null,
          };
        })
      : [];
  } catch (error) {
    console.error("Error en GET /warranties:", error);
    throw new Error("Solicitud: Ocurrió un error inesperado.");
  }
};

export type ExpiredWarrantyData = Awaited<ReturnType<typeof getAllExpiredWarranties>>;

"use server";

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
  gte,
  inmobiliarias,
  lte,
  organizations,
  statusWarranty,
  users,
  warranties,
  warrantorDocumentTypes,
  warrantors,
  warrantyDocumentTypes,
  warrantyTypes,
} from "@repo/database/db";

export const getAllWarranties = async (filter: string | null) => {
  try {
    // Determine the filter condition based on the `active` parameter
    let filterCondition;
    if (filter === "inProcess") {
      filterCondition = and(
        gte(warranties.statusWarrantyId, 1),
        lte(warranties.statusWarrantyId, 6)
      );
    } else if (filter === "Ganada") {
      filterCondition = eq(warranties.statusWarrantyId, 7);
    } else if (filter === "Perdida") {
      filterCondition = eq(warranties.statusWarrantyId, 8);
    }

    const rawWarranties = await db
      .select({
        warranty: warranties,
        user: users,
        warrantor: warrantors,
        inmobiliaria: inmobiliarias,
        address: addresses,
        statusWarranty: statusWarranty,
        currencyType: currencyTypes,
        dollarType: dollarTypes.type,
        financingType: financingTypes,
        warrantyType: warrantyTypes,
        datePeriod: datePeriods,
        coverageType: coverageTypes,
        month: warranties.month,
        organization: organizations.type,
        // document: documents,
        // warrantyDocumentType: warrantyDocumentTypes,
      })
      .from(warranties)
      .where(filterCondition ? filterCondition : undefined)
      .leftJoin(users, eq(warranties.userId, users.id))
      .leftJoin(warrantors, eq(warrantors.warrantyId, warranties.id))
      .leftJoin(inmobiliarias, eq(inmobiliarias.id, warranties.inmobiliariaId))
      .leftJoin(addresses, eq(users.addressId, addresses.id))
      .leftJoin(
        statusWarranty,
        eq(warranties.statusWarrantyId, statusWarranty.id)
      )
      .leftJoin(currencyTypes, eq(warranties.currencyTypeId, currencyTypes.id))
      .leftJoin(dollarTypes, eq(warranties.dollarTypeId, dollarTypes.id))
      .leftJoin(
        financingTypes,
        eq(warranties.financingTypeId, financingTypes.id)
      )
      .leftJoin(warrantyTypes, eq(warranties.warrantyTypeId, warrantyTypes.id))
      .leftJoin(datePeriods, eq(warranties.datePeriodId, datePeriods.id))
      .leftJoin(coverageTypes, eq(warranties.coverageTypeId, coverageTypes.id))
      .leftJoin(organizations, eq(organizations.id, users.organizationId));
    // .leftJoin(documents, eq(warranties.id, documents.warrantyId))
    // .leftJoin(
    //   warrantyDocumentTypes,
    //   eq(documents.warrantyDocumentTypesId, warrantyDocumentTypes.id)
    // );

    // Process and aggregate the results
    const { allWarranties, totalGarantia, totalReserva } = rawWarranties.reduce(
      (acc: any, row) => {
        const warrantyId = row.warranty.id;

        if (!acc.allWarranties[warrantyId]) {
          acc.allWarranties[warrantyId] = {
            ...row.warranty,
            user: row.user,
            address: row.address,
            statusWarranty: row.statusWarranty,
            currencyType: row.currencyType,
            dollarType: row.dollarType,
            financingType: row.financingType,
            warrantyType: row.warrantyType,
            datePeriod: row.datePeriod,
            coverageType: row.coverageType,
            inmobiliaria: row.inmobiliaria,
            organization: row.organization,
            // documents: row.document
            //   ? [
            //       {
            //         ...row.document,
            //         warrantyDocumentType: row.warrantyDocumentType,
            //       },
            //     ]
            //   : [],
            warrantors: row.warrantor ? [row.warrantor] : [],
          };
          acc.totalGarantia += 1;
        }

        // Add warrantors and documents to the list if not already present
        if (
          row.warrantor &&
          !acc.allWarranties[warrantyId].warrantors.some(
            (el: any) => row.warrantor?.id === el.id
          )
        ) {
          acc.allWarranties[warrantyId].warrantors.push(row.warrantor);
        }

        // if (row.document) {
        //   acc.allWarranties[warrantyId].documents.push({
        //     ...row.document,
        //     warrantyDocumentType: row.warrantyDocumentType,
        //   });
        // }

        acc.totalReserva += row.warranty.warrantyAmount || 0;

        return acc;
      },
      { allWarranties: {}, totalGarantia: 0, totalReserva: 0 }
    );

    const result = Object.values(allWarranties);

    // Map warranties based on `active` parameter
    const warrantiesInProcess = result.map((item: any) => {
      const baseFields = {
        id: item.id,
        warrantyAmount: item.warrantyAmount,
      };

      const requester = item.warrantors?.length
        ? item.warrantors?.find((el: any) => el.isRequester)
        : null;

      if (filter === "Perdida" || filter === "Ganada") {
        return {
          ...baseFields,
          responsableId: item?.user?.id || null,
          reservationDate: item?.reservationDate
            ? new Date(item.reservationDate)
            : null,
          contractDuration: item?.contractDuration || null,
          warrantyType: item?.warrantyType?.type || null,
          requesterName: requester?.fullname,
          responsable: item.user?.name || "No especificado",
          currency: item?.currencyType?.type || "ARS",
          sucursal: item?.address?.province || null,
          inmobiliaria: item?.inmobiliaria?.name || null,
          coverageType: item?.coverageType?.type || "",
          reservationAmount: item?.reservationAmount || null,
          paymentMethod: item?.financingType?.type || null,
          statusWarranty: item?.statusWarranty?.type || null,
          organization: item?.organization || null,
          month: item?.month || null,
          year: new Date(item?.reservationDate).getUTCFullYear() || null,
        };
      } else if (filter === "inProcess") {
        return {
          ...baseFields,
          cliente: requester?.fullname || null,
          inmobiliaria: item?.inmobiliaria?.name || null,
          tipo: item?.warrantyType?.type || null,
          responsable: item?.user?.name || "No especificado",
          currency: item?.currencyType?.type || "ARS",
          responsableId: item?.user?.id || null,
          sucursal: item?.address?.province || null,
          metodoPago: item?.financingType?.type || null,
          fechaInicioCarga: new Date(item?.createdAt),
          statusWarranty: item?.statusWarranty?.type || null,
          organization: item?.organization || null,
          month: item?.month || null,
          year: new Date(item?.createdAt).getUTCFullYear() || null,
        };
      } else {
        return { ...item };
      }
    });

    const warrantyData = {
      totalGarantia,
      totalReserva,
      garantias: warrantiesInProcess,
    };

    return warrantyData;
  } catch (error) {
    console.error("Error en GET /warranties:", error);
    // throw new Error("Solicitud: Ocurrió un error inesperado.");
  }
};

export async function getWarrantyById(id: string) {
  const warranty = await db.query.warranties.findFirst({
    where: eq(warranties.id, id),
  });

  if (warranty?.id) {
    return warranty;
  } else {
    throw Error("Error: Garantia no encontrada");
  }
}

export async function getWarrantyRelations(id: string) {
  try {
    let warrantyWithRelations: any = await db
      .select()
      .from(warranties)
      .where(eq(warranties.id, id))
      .leftJoin(users, eq(warranties.userId, users.id))
      .leftJoin(addresses, eq(warranties.addressId, addresses.id))
      .leftJoin(
        statusWarranty,
        eq(warranties.statusWarrantyId, statusWarranty.id)
      )
      .leftJoin(currencyTypes, eq(warranties.currencyTypeId, currencyTypes.id))
      .leftJoin(dollarTypes, eq(warranties.dollarTypeId, dollarTypes.id))
      .leftJoin(
        financingTypes,
        eq(warranties.financingTypeId, financingTypes.id)
      )
      .leftJoin(warrantyTypes, eq(warranties.warrantyTypeId, warrantyTypes.id))
      .leftJoin(datePeriods, eq(warranties.datePeriodId, datePeriods.id))
      .leftJoin(coverageTypes, eq(warranties.coverageTypeId, coverageTypes.id));

    let documentsForWarranty = await db
      .select()
      .from(documents)
      .where(eq(documents.warrantyId, id))
      .leftJoin(
        warrantyDocumentTypes,
        eq(documents.warrantyDocumentTypesId, warrantyDocumentTypes.id)
      );

    if (warrantyWithRelations[0]?.warranties?.inmobiliariaId) {
      let inmoWithAddress = await db
        .select()
        .from(inmobiliarias)
        .where(
          eq(
            inmobiliarias.id,
            warrantyWithRelations[0]?.warranties?.inmobiliariaId
          )
        )
        .leftJoin(addresses, eq(addresses.id, inmobiliarias.addressId));

      warrantyWithRelations[0].inmobiliarias = inmoWithAddress?.length
        ? {
            ...inmoWithAddress[0]?.inmobiliarias,
            addresses: inmoWithAddress[0]?.addresses,
          }
        : null;
    }

    let warrantorsWithRelations: any = await db
      .select({
        id: warrantors.id,
        name: warrantors.name,
        lastname: warrantors.lastname,
        email: warrantors.email,
        phone: warrantors.phone,
        dni: warrantors.dni,
        nacionality: warrantors.nacionality,
        province: addresses.province,
        city: addresses.city,
        street: addresses.street,
        intersectionOne: addresses.intersectionOne,
        intersectionTwo: addresses.intersectionTwo,
        number: addresses.number,
        isRequester: warrantors.isRequester,
        isOwner: warrantors.isOwner,
        postal_code: addresses.postalCode,
      })
      .from(warrantors)
      .where(eq(warrantors.warrantyId, id))
      .leftJoin(addresses, eq(warrantors.addressId, addresses.id));

    // Recorrer cada warrantor y obtener los documentos para cada uno
    for (let warrantor of warrantorsWithRelations) {
      // Obtener los documentos del warrantor
      let documentsForWarrantor = await db
        .select()
        .from(documents)
        .where(eq(documents.warrantorId, warrantor.id)) // Se filtra por el ID del warrantor
        .leftJoin(
          warrantorDocumentTypes,
          eq(documents.warrantorDocumentTypesId, warrantorDocumentTypes.id)
        );

      // Asignar los documentos al warrantor
      warrantor.documents = documentsForWarrantor;
    }

    if (warrantyWithRelations.length) {
      warrantyWithRelations[0].documents = documentsForWarranty; // Asignar los documentos de la garantía
      return {
        warrantyWithRelations: warrantyWithRelations[0],
        warrantorsWithRelations, // Aquí retornas los warrantors con sus documentos
      };
    } else {
      throw new Error("Error: No se pudo traer información de la garantía");
    }
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}

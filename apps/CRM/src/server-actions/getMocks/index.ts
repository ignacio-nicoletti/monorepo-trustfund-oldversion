"use server";

import db from "@repo/database/db";

export async function getMockData() {
  const rolesTypes = await db.query.roles.findMany({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
  });
  const organizationsTypes = await db.query.organizations.findMany({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
  });

  const coverageTypes = await db.query.coverageTypes.findMany({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
  });

  const currencyTypes = await db.query.currencyTypes.findMany({
    columns: {
      id: true,
      type: true,
    },
  });

  const dollarTypes = await db.query.dollarTypes.findMany({
    columns: {
      id: true,
      type: true,
    },
  });

  const financingTypes = await db.query.financingTypes.findMany({
    columns: {
      id: true,
      type: true,
    },
  });

  const warrantorDocumentTypes = await db.query.warrantorDocumentTypes.findMany({
    columns: {
      id: true,
      type: true,
    },
  });

  const warrantyDocumentTypes = await db.query.warrantyDocumentTypes.findMany({
    columns: {
      id: true,
      type: true,
    },
  });

  const warrantyStatus = await db.query.statusWarranty.findMany({
    columns: {
      id: true,
      type: true,
    },
  });

  const warrantyTypes = await db.query.warrantyTypes.findMany({
    columns: {
      id: true,
      type: true,
    },
  });

  const urlTypes = await db.query.urlTypes.findMany({
    columns: {
      id: true,
      type: true,
    },
  });
  const mainFolders = await db.query.mainFolders.findMany({
    columns: {
      id: true,
      year: true,
      month: true,
      url: true
    },
  });

  if (
    coverageTypes.length > 0 &&
    currencyTypes.length > 0 &&
    dollarTypes.length > 0 &&
    financingTypes.length > 0 &&
    warrantorDocumentTypes.length > 0 &&
    warrantyDocumentTypes.length > 0 &&
    warrantyStatus.length > 0 &&
    organizationsTypes.length > 0 &&
    warrantyTypes.length > 0 &&
    rolesTypes.length > 0 &&
    urlTypes.length > 0 &&
    mainFolders.length > 0
  ) {
    return {
      coverageTypes,
      currencyTypes,
      dollarTypes,
      financingTypes,
      warrantorDocumentTypes,
      warrantyDocumentTypes,
      warrantyStatus,
      organizationsTypes,
      warrantyTypes,
      rolesTypes,
      urlTypes,
      mainFolders
    };
  } else {
    throw Error("Solicitud: Error al traer información de la db");
  }
}

export type MockData = Awaited<ReturnType<typeof getMockData>>;

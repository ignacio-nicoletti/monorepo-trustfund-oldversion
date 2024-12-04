import { relations } from "drizzle-orm";
import {
  addresses,
  barrios,
  coverageTypes,
  currencyTypes,
  datePeriods,
  documents,
  warrantyDocumentTypes,
  warrantorDocumentTypes,
  dollarTypes,
  dollarValues,
  financingTypes,
  inmobiliarias,
  localidades,
  partidos,
  provincias,
  organizations,
  quotas,
  roles,
  statusWarranty,
  subProvincias,
  users,
  warranties,
  expiredWarranties,
  warrantors,
  warrantyTypes,
  urlSign,
  urlTypes,
  expiredWarrantyToWarrantor
} from "./schemas/index.ts";

// ----------------------------------- ** RELATIONS ** ----------------------------------------------------------- //
export const addressesRelations = relations(addresses, ({ one }) => ({
  inmobiliarias: one(inmobiliarias),
  users: one(users),
  warranties: one(warranties),
  expiredWarranties: one(expiredWarranties),
  warrantors: one(warrantors),
}));

export const barrioRelations = relations(barrios, ({ one }) => ({
  localidad: one(localidades, {
    fields: [barrios.LocalidadId],
    references: [localidades.id],
  }),
  provinciaBarrioIdToProvincia: one(provincias, {
    fields: [barrios.ProvinciaBarrioId],
    references: [provincias.id],
  }),
  provinciumIdToProvincia: one(provincias, {
    fields: [barrios.ProvinciumId],
    references: [provincias.id],
  }),
}));

export const coverageTypesRelations = relations(coverageTypes, ({ many }) => ({
  warranties: many(warranties),
}));

export const currencyTypesRelations = relations(currencyTypes, ({ many }) => ({
  warranties: many(warranties),
}));

export const datePeriodsRelations = relations(datePeriods, ({ one }) => ({
  warranties: one(warranties),
}));
export const dollarTypesRelations = relations(dollarTypes, ({ one, many }) => ({
  warranties: many(warranties),
}));

export const dollarValuesRelations = relations(dollarValues, ({ one }) => ({
  dollarType: one(dollarTypes),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  warrantor: one(warrantors, {
    fields: [documents.warrantorId],
    references: [warrantors.id],
  }),
  warranty: one(warranties, {
    fields: [documents.warrantyId],
    references: [warranties.id],
  }),
  expiredWarranty: one(expiredWarranties, {
    fields: [documents.expiredWarrantyId],
    references: [expiredWarranties.id],
  }),
  warrantyDocumentType: one(warrantyDocumentTypes, {
    fields: [documents.warrantyDocumentTypesId],
    references: [warrantyDocumentTypes.id],
  }),
  warrantorDocumentType: one(warrantorDocumentTypes, {
    fields: [documents.warrantorDocumentTypesId],
    references: [warrantorDocumentTypes.id],
  }),
}));

export const warrantyDocumentTypesRelations = relations(
  warrantyDocumentTypes,
  ({ many }) => ({
    documents: many(documents),
  })
);
export const warrantorDocumentTypesRelations = relations(
  warrantorDocumentTypes,
  ({ many }) => ({
    documents: many(documents),
  })
);

export const financingTypesRelations = relations(
  financingTypes,
  ({ many }) => ({
    warranties: many(warranties),
  })
);

export const inmobiliariasRelations = relations(
  inmobiliarias,
  ({ one, many }) => ({
    users: one(users, {
      fields: [inmobiliarias.responsableId],
      references: [users.id], // Ensure `users.id` is uuid
    }),
    warranties: many(warranties),
    expiredWarranties: many(expiredWarranties),
    organizations: one(organizations, {
      fields: [inmobiliarias.organizationId],
      references: [organizations.id], // Ensure `users.id` is uuid
    }),
  })
);

export const localidadRelations = relations(localidades, ({ many, one }) => ({
  barrios: many(barrios),
  partido: one(partidos, {
    fields: [localidades.PartidoId],
    references: [partidos.id],
  }),
  provinciaLocalidadIdToProvincia: one(provincias, {
    fields: [localidades.ProvinciaLocalidadId],
    references: [provincias.id],
  }),
  provinciumIdToProvincia: one(provincias, {
    fields: [localidades.ProvinciumId],
    references: [provincias.id],
  }),
}));

export const partidoRelations = relations(partidos, ({ many, one }) => ({
  localidades: many(localidades),
  provinciaPartidoIdToProvincia: one(provincias, {
    fields: [partidos.ProvinciaPartidoId],
    references: [provincias.id],
  }),
  provinciumIdToProvincia: one(provincias, {
    fields: [partidos.ProvinciumId],
    references: [provincias.id],
  }),
  subProvincia: one(subProvincias, {
    fields: [partidos.SubProvinciumId],
    references: [subProvincias.id],
  }),
}));

export const provinciaRelations = relations(provincias, ({ many }) => ({
  barriosBarrioProvinciaBarrioIdToProvincia: many(barrios),
  barriosProvinciumIdToProvincia: many(barrios),
  localidadesLocalidadIdToProvincia: many(localidades),
  localidadesProvinciumIdToProvincia: many(localidades),
  partidosPartidoIdToProvincia: many(partidos),
  partidosProvinciumIdToProvincia: many(partidos),
  subProvincias: many(subProvincias),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  inmobiliarias: many(inmobiliarias),
}));

export const quotasRelations = relations(quotas, ({ one }) => ({
  warranty: one(warranties, {
    fields: [quotas.warrantyId],
    references: [warranties.id],
  }),
  expiredWarranty: one(expiredWarranties, {
    fields: [quotas.expiredWarrantyId],
    references: [expiredWarranties.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const statusWarrantyRelations = relations(
  statusWarranty,
  ({ many }) => ({
    warranties: many(warranties),
  })
);

export const subProvinciaRelations = relations(
  subProvincias,
  ({ many, one }) => ({
    partidos: many(partidos),
    provincia: one(provincias, {
      fields: [subProvincias.ProvinciumId],
      references: [provincias.id],
    }),
  })
);

export const urlSignRelations = relations(urlSign, ({ one }) => ({
  warrantors: one(warrantors, {
    fields: [urlSign.warrantorId],
    references: [warrantors.id], // Ensure `users.id` is uuid
  }),
  expiredWarranties: one(expiredWarranties, {
    fields: [urlSign.expiredWarrantyId],
    references: [expiredWarranties.id], // Ensure `users.id` is uuid
  }),
  urlTypes: one(urlTypes, {
    fields: [urlSign.urlTypeId],
    references: [urlTypes.id], // Ensure `users.id` is uuid
  }),
}));

export const urlTypesRelations = relations(urlTypes, ({ many }) => ({
  urlSign: many(urlSign),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  warranties: many(warranties),
  expiredWarranties: many(expiredWarranties),
  inmobiliarias: many(inmobiliarias),
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id], // Ensure `users.id` is uuid
  }),
  role: one(roles, {
    fields: [users.role],
    references: [roles.id],
  }),
}));

export const expiredWarrantyToWarrantorRelations = relations(
  expiredWarrantyToWarrantor,
  ({ one }) => ({
    warrantors: one(warrantors, {
      fields: [expiredWarrantyToWarrantor.warrantorId],
      references: [warrantors.id],
    }),
    expiredWarranties: one(expiredWarranties, {
      fields: [expiredWarrantyToWarrantor.expiredWarrantyId],
      references: [expiredWarranties.id],
    }),
  })
);

export const warrantorsRelations = relations(warrantors, ({ many, one }) => ({
  warranties: one(warranties, {
    fields: [warrantors.warrantyId],
    references: [warranties.id]
  }),
  documents: many(documents),
  urlSign: many(urlSign),
  expiredWarranties: many(expiredWarranties),
}));

export const warrantiesRelations = relations(warranties, ({ many, one }) => ({
  user: one(users, {
    fields: [warranties.userId],
    references: [users.id],
  }),
  inmobiliaria: one(inmobiliarias, {
    fields: [warranties.inmobiliariaId],
    references: [inmobiliarias.id],
  }),
  statusWarranty: one(statusWarranty, {
    fields: [warranties.statusWarrantyId],
    references: [statusWarranty.id],
  }),
  currencyType: one(currencyTypes, {
    fields: [warranties.currencyTypeId],
    references: [currencyTypes.id],
  }),
  dollarType: one(dollarTypes, {
    fields: [warranties.dollarTypeId],
    references: [dollarTypes.id],
  }),
  financingType: one(financingTypes, {
    fields: [warranties.financingTypeId],
    references: [financingTypes.id],
  }),
  warrantyType: one(warrantyTypes, {
    fields: [warranties.warrantyTypeId],
    references: [warrantyTypes.id],
  }),
  coverageType: one(coverageTypes, {
    fields: [warranties.coverageTypeId],
    references: [coverageTypes.id],
  }),
  warrantors: many(warrantors),
  documents: many(documents),
  quotas: many(quotas),
}));

export const warrantyTypesRelations = relations(warrantyTypes, ({ many }) => ({
  warranties: many(warranties),
}));

export const expiredWarrantiesRelations = relations(expiredWarranties, ({ many, one }) => ({
  user: one(users, {
    fields: [expiredWarranties.userId],
    references: [users.id],
  }),
  inmobiliaria: one(inmobiliarias, {
    fields: [expiredWarranties.inmobiliariaId],
    references: [inmobiliarias.id],
  }),
  statusWarranty: one(statusWarranty, {
    fields: [expiredWarranties.statusWarrantyId],
    references: [statusWarranty.id],
  }),
  currencyType: one(currencyTypes, {
    fields: [expiredWarranties.currencyTypeId],
    references: [currencyTypes.id],
  }),
  dollarType: one(dollarTypes, {
    fields: [expiredWarranties.dollarTypeId],
    references: [dollarTypes.id],
  }),
  financingType: one(financingTypes, {
    fields: [expiredWarranties.financingTypeId],
    references: [financingTypes.id],
  }),
  warrantyType: one(warrantyTypes, {
    fields: [expiredWarranties.warrantyTypeId],
    references: [warrantyTypes.id],
  }),
  coverageType: one(coverageTypes, {
    fields: [expiredWarranties.coverageTypeId],
    references: [coverageTypes.id],
  }),
  urlSign: many(urlSign),
  documents: many(documents),
  warrantors: many(warrantors),
  quotas: many(quotas),
}));

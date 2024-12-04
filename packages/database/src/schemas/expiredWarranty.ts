import { sql } from "drizzle-orm";
import { index, integer, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import addresses from "./address.ts";
import datePeriods from "./datePeriod.ts";

//! MIRAR FIGMA AÑADIR NUEVAS PROPIEDADES AL MODELO
// Tabla Warranty
const expiredWarranties = pgTable("expiredWarranties", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  contractDuration: text("contractDuration"), // Duración del alquiler (ej. 12 meses, 24 meses)
  warrantyAmount: real("warrantyAmount"), // Monto de la garantía
  warrantyAmountLessReservation: real("warrantyAmountLessReservation"), // Monto de la garantía menos el valor de reserva
  reservationAmount: real("reservationAmount"), // Monto de la reserva
  reservationDate: timestamp("reservationDate", {
    withTimezone: true,
    mode: "string",
  }), // Fecha de la reserva
  month: text("month"),
  warrantyTypeId: integer("warrantyTypeId"), // Tipo de garantía
  coverageTypeId: integer("coverageTypeId"), // Tipo de cobertura (ej. basica, intermedia, etc)
  userId: uuid("userId"), // Relación con User
  financingTypeId: integer("financingTypeId"),
  inmobiliariaId: uuid("inmobiliariaId"), // Relación con Inmobiliaria
  addressId: uuid("addressId").references(() => addresses.id), // Relación con Address
  datePeriodId: uuid("datePeriodId").references(() => datePeriods.id), // Relación con el periodo de duracion del alquiler y de la garantia (la garantia cubro por lo que dure el alquiler)
  currencyTypeId: integer("currencyTypeId"), // Relación con el tipo de moneda
  dollarTypeId: integer("dollarTypeId"), // Relación con el tipo de dollar (que sea opcional)
  statusWarrantyId: integer("statusWarrantyId"),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default expiredWarranties;
export type InferExpiredWarranty = typeof expiredWarranties.$inferSelect;
export type InsertExpiredWarranty = typeof expiredWarranties.$inferInsert;

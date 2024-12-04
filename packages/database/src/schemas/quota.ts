import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const enum_Quotas_status = pgEnum("enum_Quotas_status", [
  "Pendiente",
  "Pago",
  "Deuda",
]);

// Tabla Quota
const quotas = pgTable("quotas", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  numberOfQuota: integer("numberOfQuota"), // Número de cuotas
  amount: real("amount"), // Monto
  expiration: timestamp("expiration", {
    withTimezone: true,
    mode: "string",
  }), // Fecha de expiración
  status: enum_Quotas_status("status").default("Pendiente"), // Estado de la cuota
  paidPreviously: boolean("paidPreviously"), // Indica si fue pagada previamente
  folderName: text("folderName"),
  driveFolderId: text("driveFolderId"),
  receiptPayment: text("reciept"),
  proofPayment: text("proofPayment"),
  interest: real("interest"), // Interés aplicado
  month: text("month"),
  warrantyId: uuid("warrantyId"),
  expiredWarrantyId: uuid("expiredWarrantyId"),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default quotas;
export type InferQuota = typeof quotas.$inferSelect;
export type InsertQuota = typeof quotas.$inferInsert;

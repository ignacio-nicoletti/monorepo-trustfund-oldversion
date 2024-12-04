import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";


// Tabla Roles
const urlSign = pgTable("urlSign", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  url: text("url"), // url de firma
  urlTypeId: serial("urlTypeId"),
  warrantorId: uuid("warrantorId"), // Relación con Warrantor
  expiredWarrantyId: uuid("expiredWarrantyId"), // Relación con Warrantor
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default urlSign;
export type InferUrlSign = typeof urlSign.$inferSelect;
export type InsertUrlSign = typeof urlSign.$inferInsert;

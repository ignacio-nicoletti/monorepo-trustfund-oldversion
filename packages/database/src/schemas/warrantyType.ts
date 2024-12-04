import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Tabla WarrantyType
const warrantyTypes = pgTable("warrantyTypes", {
  id: serial("id").primaryKey(),
  type: text("type"), // Tipo de garantía
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default warrantyTypes;
export type InferWarrantyType = typeof warrantyTypes.$inferSelect;
export type InsertWarrantyType = typeof warrantyTypes.$inferInsert;

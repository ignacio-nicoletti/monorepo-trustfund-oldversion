import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Tabla statusWarranty
const urlTypes = pgTable("urlTypes", {
  id: serial("id").primaryKey(),
  type: text("type"), // Tipo de dólar
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default urlTypes;
export type InferUrlType = typeof urlTypes.$inferSelect;
export type InsertUrlType = typeof urlTypes.$inferInsert;
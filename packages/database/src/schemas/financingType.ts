import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Tabla FinancingType
const financingTypes = pgTable("financingTypes", {
  id: serial("id").primaryKey(),
  type: text("type"), // Nombre del tipo de cuota
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default financingTypes;
export type InferFinancingType = typeof financingTypes.$inferSelect;
export type InsertFinancingType = typeof financingTypes.$inferInsert;

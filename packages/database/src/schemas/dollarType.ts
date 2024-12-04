import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import dollarValues from "./dollarValue.ts";

// Tabla DollarType
const dollarTypes = pgTable("dollarTypes", {
  id: serial("id").primaryKey(),
  type: text("type"), // Tipo de dólar
  dollarValueId: serial("dollarValueId").references(()=> dollarValues.id),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default dollarTypes;
export type InferDollarType = typeof dollarTypes.$inferSelect;
export type InsertDollarType = typeof dollarTypes.$inferInsert;

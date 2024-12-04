import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Tabla CurrencyType
const currencyTypes = pgTable("currencyTypes", {
  id: serial("id").primaryKey(),
  type: text("type"), // Tipo de moneda
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});
export default currencyTypes;
export type InferCurrencyType = typeof currencyTypes.$inferSelect;
export type InsertCurrencyType = typeof currencyTypes.$inferInsert;

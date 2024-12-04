import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Tabla statusWarranty
const statusWarranty = pgTable("statusWarranty", {
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
export default statusWarranty;
export type InferStatusWarranty = typeof statusWarranty.$inferSelect;
export type InsertStatusWarranty = typeof statusWarranty.$inferInsert;

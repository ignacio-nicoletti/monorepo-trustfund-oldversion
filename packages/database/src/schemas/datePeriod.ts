import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

// Tabla DatePeriod
const datePeriods = pgTable("datePeriods", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  startDate: timestamp("startDate", {
    withTimezone: true,
    mode: "string",
  }), // Fecha de inicio
  endDate: timestamp("endDate", {
    withTimezone: true,
    mode: "string",
  }), // Fecha de fin
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});
export default datePeriods;
export type InferDatePeriod = typeof datePeriods.$inferSelect;
export type InsertDatePeriod = typeof datePeriods.$inferInsert;

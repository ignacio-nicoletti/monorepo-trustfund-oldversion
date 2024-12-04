import { pgTable, real, serial, text, timestamp } from "drizzle-orm/pg-core";

// Tabla ContractType
const coverageTypes = pgTable("coverageTypes", {
  id: serial("id").primaryKey(),
  type: text("type"), // Tipo de contrato
  percentage: real("percentage"),
  percentageStr: text("percentageStr"),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default coverageTypes;
export type InferCoverageType = typeof coverageTypes.$inferSelect;
export type InsertCoverageType = typeof coverageTypes.$inferInsert;

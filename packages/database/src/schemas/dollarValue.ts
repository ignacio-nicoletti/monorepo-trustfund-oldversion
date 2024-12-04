import {
  pgTable,
  real,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";


// Tabla DollarValue
const dollarValues = pgTable("dollarValues", {
  id: serial("id").primaryKey(),
  lastValue: real("lastValue"),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default dollarValues;
export type InferDollarValue = typeof dollarValues.$inferSelect;
export type InsertDollarValue = typeof dollarValues.$inferInsert;

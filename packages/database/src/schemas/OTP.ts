import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Tabla OTPs
export const OTPs = pgTable("OTPs", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .unique(),
  email: text("email"), // Corrected column name
  otp: integer("otp"),
  userId: uuid("userId"),
  expirationAt: timestamp("expirationAt", { withTimezone: true, mode: "string" }), // Corrected type
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});


export default OTPs;
export type InferOTPs = typeof OTPs.$inferSelect;
export type InsertOTPs = typeof OTPs.$inferInsert;

import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Tabla Organization
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  type: text("name"), // Nombre de la organización
  logoUrl: text("logoUrl"), // URL del logo
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default organizations;
export type InferOrganization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

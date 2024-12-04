import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Tabla Roles
const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  type: text("type"), // Nombre del rol
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default roles;
export type InferRole = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

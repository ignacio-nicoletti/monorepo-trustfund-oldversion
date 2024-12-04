import { sql } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import addresses from "./address.ts";

export const enum_Users_status = pgEnum("enum_Users_status", ["Active", "Deleted"]);

// Tabla User
const users = pgTable("users", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text("name"),
  lastname: text("lastname"),
  email: text("email").unique(),
  password: text("password"),
  warrantiesWon: integer("warrantiesWon").default(0).notNull(), // Contador de garantias cerradas ganadas
  warrantiesInProcess: integer("warrantiesInProcess").default(0).notNull(), // Contador de warranties totales
  warrantiesLost: integer("warrantiesLost").default(0).notNull(), // Contador de garantias cerradas perdidas
  status: enum_Users_status("status").notNull().default("Active"), // (enum, active, deleted)
  image_profile: text("image_profile"),
  organizationId: integer("organizationId"), 
  role: integer("role"),
  addressId: uuid("addressId").references(() => addresses.id),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  deletedAt: timestamp("deletedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});
export default users;
export type InferUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

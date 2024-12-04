import { sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import addresses from "./address.ts";
import users from "./user.ts";

export const enum_Inmobiliarias_status = pgEnum("enum_Inmobiliarias_status", ["Active", "Deleted"]);

// Tabla Inmobiliaria
const inmobiliarias = pgTable("inmobiliarias", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text("name"),
  inmoAgent: text("inmoAgent"),
  phone: varchar("phone"),
  email: text("email"),
  comment: text("comment"),
  web: text("web"),
  status: enum_Inmobiliarias_status("status").notNull().default("Active"),
  order: serial("order"),
  organizationId: integer("organizationId"),
  warrantiesWon: integer("warrantiesWon").default(0).notNull(), // Contador de garantias cerradas ganadas
  warrantiesInProcess: integer("warrantiesInProcess").default(0).notNull(), // Contador de warranties totales
  warrantiesLost: integer("warrantiesLost").default(0).notNull(), // Contador de garantias cerradas perdidas
  addressId: uuid("addressId").references(() => addresses.id),
  responsableId: uuid("responsableId").references(() => users.id), // Changed to reference users  addressId: integer("addressId").references(() => addresses.id), // Relación con Address
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

export default inmobiliarias;
export type InferInmobiliaria = typeof inmobiliarias.$inferSelect;
export type InsertInmobiliaria = typeof inmobiliarias.$inferInsert;

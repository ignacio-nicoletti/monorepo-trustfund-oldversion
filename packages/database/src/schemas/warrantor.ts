import { sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import addresses from "./address.ts";

// Tabla Warrantor
const warrantors = pgTable("warrantors", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .unique(),
  name: text("name"),
  lastname: text("lastname"),
  fullname: text("fullname"),
  phone: varchar("phone"),
  dni: varchar("dni"),
  email: text("email"),
  nacionality: text("nacionality"),
  driveFolderId: text("driveFolderId"),
  folderName: varchar("folderName", { length: 255 }),
  isRequester: boolean("isRequester"), // booleano para definir si es solicitante
  isOwner: boolean("isOwner"), // booleano para definir si es propietario
  availability: boolean("availability"), //booleano para ser garante de una garantia
  warrantyId: uuid("warrantyId"), // Relación con Warrantor
  addressId: uuid("addressId").references(() => addresses.id), // Relación con Address
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default warrantors;
export type InferWarrantor = typeof warrantors.$inferSelect;
export type InsertWarrantor = typeof warrantors.$inferInsert;

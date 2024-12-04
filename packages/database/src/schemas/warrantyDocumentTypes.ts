import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Tabla DocumentType
const warrantyDocumentTypes = pgTable("warrantyDocumentTypes", {
  id: serial("id").primaryKey(),
  type: text("type"), // Nombre del tipo de documento
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default warrantyDocumentTypes;
export type InferWarrantyDocumentTypes = typeof warrantyDocumentTypes.$inferSelect;
export type InsertWarrantyDocumentTypes = typeof warrantyDocumentTypes.$inferInsert;

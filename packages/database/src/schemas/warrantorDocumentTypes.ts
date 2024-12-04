import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Tabla DocumentType
const warrantorDocumentTypes = pgTable("warrantorDocumentTypes", {
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

export default warrantorDocumentTypes;
export type InferWarrantorDocumentTypes = typeof warrantorDocumentTypes.$inferSelect;
export type InsertWarrantorDocumentTypes = typeof warrantorDocumentTypes.$inferInsert;

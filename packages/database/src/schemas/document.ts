import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm";

// Tabla Document
const documents = pgTable("documents", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  url: text("url"),
  name: text("name"),
  warrantorDocumentTypesId: integer("warrantorDocumentTypesId"),
  warrantyDocumentTypesId: integer("warrantyDocumentTypesId"),
  warrantorId: uuid("warrantorId"),
  warrantyId: uuid("warrantyId"),
  expiredWarrantyId: uuid("expiredWarrantyId"),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});
export default documents;
export type InferDocument = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

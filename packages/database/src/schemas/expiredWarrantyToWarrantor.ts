import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import warrantors from "./warrantor.ts";
import expiredWarranties from "./expiredWarranty.ts";

export const expiredWarrantyToWarrantor = pgTable(
  "warrantor_to_expired_warranty",
  {
    warrantorId: uuid("warrantorId")
      .references(() => warrantors.id) // Relación con Warrantor usando UUID
      .notNull(),
    expiredWarrantyId: uuid("expiredWarrantyId")
      .references(() => expiredWarranties.id) // Relación con Warranty usando UUID
      .notNull(),
  },
  (table) => {
    return {
      pkWithCustomName: primaryKey({ name: "id", columns: [table.warrantorId, table.expiredWarrantyId] }),
    };
  }
);

export default expiredWarrantyToWarrantor;
export type InferExpiredWarrantyToWarrantor = typeof expiredWarranties.$inferSelect;
export type InsertExpiredWarrantyToWarrantor = typeof expiredWarranties.$inferInsert;

import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const subProvincias = pgTable("subProvincias", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  ProvinciumId: uuid("ProvinciumId"),
});

export default subProvincias;
export type InferSubProvincia = typeof subProvincias.$inferSelect;
export type InsertSubProvincia = typeof subProvincias.$inferInsert;

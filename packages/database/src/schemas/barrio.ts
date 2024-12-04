import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const barrios = pgTable("barrios", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  LocalidadId: uuid("LocalidadId"),
  ProvinciumId: uuid("ProvinciumId"),
  ProvinciaBarrioId: uuid("ProvinciaBarrioId"),
});

export default barrios;
export type InferBarrio = typeof barrios.$inferSelect;
export type InsertBarrio = typeof barrios.$inferInsert;

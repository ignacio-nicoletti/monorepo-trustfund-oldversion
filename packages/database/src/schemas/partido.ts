import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const partidos = pgTable("partidos", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  SubProvinciumId: uuid("SubProvinciumId"),
  ProvinciumId: uuid("ProvinciumId"),
  ProvinciaPartidoId: uuid("ProvinciaPartidoId"),
});



export default partidos;
export type InferPartido = typeof partidos.$inferSelect;
export type InsertPartido = typeof partidos.$inferInsert;

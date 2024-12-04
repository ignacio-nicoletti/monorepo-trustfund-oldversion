import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const localidades = pgTable("localidades", {
    id: uuid("id").defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    PartidoId: uuid("PartidoId"),
    ProvinciumId: uuid("ProvinciumId"),
    ProvinciaLocalidadId: uuid("ProvinciaLocalidadId"),
  });
  
export default localidades
export type InferLocalidad = typeof localidades.$inferSelect;
export type InsertLocalidad = typeof localidades.$inferInsert;
import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Tabla Roles
const mainFolders = pgTable("mainFolders", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  year: integer("year"),
  month: text("month"),
  url: text("url"), // url de firma
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default mainFolders;
export type InferMainFolder = typeof mainFolders.$inferSelect;
export type InsertMainFolder = typeof mainFolders.$inferInsert;

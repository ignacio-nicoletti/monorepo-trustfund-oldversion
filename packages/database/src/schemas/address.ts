import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Tabla Address
const addresses = pgTable("addresses", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .unique(),
  street: text("street"),
  number: integer("number"),
  intersectionOne: text("intersectionOne"),
  intersectionTwo: text("intersectionTwo"),
  apartment: text("apartment"),
  country: text("country"),
  province: text("province"),
  state: text("state"),
  city: text("city"),
  domicilio:text("domicilio"),
  postalCode: varchar("postalCode"),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export default addresses;
export type InferAddress = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;

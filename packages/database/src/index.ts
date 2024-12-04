export * from "./schema.ts";
import * as schema from "./schema.ts"
export * from "./relations.ts";
export * from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config();

import { drizzle } from 'drizzle-orm/node-postgres';
// You can specify any property from the node-postgres connection options
const db = drizzle({ 
  connection: { 
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL!,
    application_name: "crm-trustfund"
    //! SOLO PARA PROD
    // ssl: true
  },
  schema: schema
});

export default db
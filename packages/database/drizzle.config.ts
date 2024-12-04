import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  //* Correr esquemas
  schema: "./src/schema.ts",
  //! borrar db
  // schema: "./src/schema.delete.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  out: "./drizzle",
});

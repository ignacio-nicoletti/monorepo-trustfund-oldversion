import { sql } from "drizzle-orm";
import db from "../index.ts";
import fs from "fs/promises";
import fileSystem from "node:fs";
import path from "node:path";
import __dirname from "../dirname.ts";

async function deleteDrizzleFolder() {
  const drizzlePath = path.join(__dirname, "..", "drizzle");
  try {
    // Check if the folder exists
    if (fileSystem.existsSync(drizzlePath)) {
      await fs.access(drizzlePath);
      // Remove the folder recursively
      await fs.rm(drizzlePath, { recursive: true, force: true });
      console.log("Carpeta 'drizzle' eliminada exitosamente.");
    } else {
      console.log("No existe la carpeta drizzle o fue eliminada.");
    }
  } catch (error) {
    console.error("No se pudo eliminar la carpeta 'drizzle' o no existe:", error);
  }
}

async function resetSchemas() {
  try {
    // Elimina el esquema drizzle si existe
    await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE`);

    // Elimina el esquema public si existe
    await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);

    // Crea el esquema public de nuevo
    await db.execute(sql`CREATE SCHEMA public`);

    // Otorga permisos al esquema public
    await db.execute(sql`GRANT ALL ON SCHEMA public TO public`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO postgres`); // Reemplaza con tu nombre de usuario

    await deleteDrizzleFolder();
    console.log("Esquemas 'public' y 'drizzle' eliminados y 'public' recreado exitosamente.");
  } catch (error) {
    console.error("Error al eliminar o crear los esquemas:", error);
  } finally {
    console.log("Finalicé");
    return;
  }
}

resetSchemas();

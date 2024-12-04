import __dirname from "../dirname.ts";
import fs from "node:fs";
import path from "node:path";

// Importar el objeto de conexión de Drizzle
import {
  inmobiliarias,
  users,
  addresses,
  datePeriods,
  documents,
  quotas,
  warranties,
  warrantors,
  urlSign,
} from "../schema.ts";
import db from "../index.ts";

const errorDir = path.join(__dirname, "backups", "errors", "errors.txt");
const errors: any[] = [];

async function seedDatabase() {
  const backupDir = path.join(__dirname, "backups/exports");

  console.time("Terminé de subir los seeders");

  try {
    const entities = [
      { name: "addresses", model: addresses },
      { name: "users", model: users },
      { name: "inmobiliarias", model: inmobiliarias },
      { name: "datePeriods", model: datePeriods },
      { name: "warranties", model: warranties },
      { name: "warrantors", model: warrantors },
      { name: "quotas", model: quotas },
      { name: "documents", model: documents },
      { name: "urlSign", model: urlSign },
    ];

    for (const entity of entities) {
      console.log(`Subiendo ${entity.name}`);
      const data = JSON.parse(fs.readFileSync(`${backupDir}/${entity.name}.json`, "utf8"));
      if (data && data.length > 0) {
        await db.delete(entity.model);
        await db.insert(entity.model).values(data).onConflictDoNothing();
      }
    }

    console.log("Terminé de subir los seeders");
  } catch (error) {
    console.error("Error al subir los seeders:", error);
    errors.push(error);
    fs.writeFileSync(errorDir, JSON.stringify(errors, null, 2), "utf-8");
  } finally {
    console.timeEnd("Terminé de subir los seeders");
  }
}

export default seedDatabase;

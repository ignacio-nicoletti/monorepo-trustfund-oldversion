import fs from "node:fs";
import path from "node:path";
import db, { and, eq } from "../index.ts"; // Asegúrate de importar tu conexión a Drizzle
import __dirname from "../dirname.ts"; // Asegúrate de que `__dirname` esté correctamente configurado
// Importa tus tablas (equivalente a los modelos de Prisma)
import { provincias, subProvincias, partidos, localidades, barrios } from "../schema.ts"; // Cambia por los nombres reales de tus tablas


const backupDir = path.join(__dirname, "backups/exports");
const data = JSON.parse(fs.readFileSync(`${backupDir}/new-data-pais.json`, "utf8"));

async function handleLocations() {
  console.time("Localidades cargadas");

  for (const objeto of data) {
    // Buscar o crear la provincia
    let provinciaDB = await db
      .select({
        id: provincias.id,
        name: provincias.name,
      })
      .from(provincias)
      .where(eq(provincias.name, objeto.Provincia))
      .execute();

    if (provinciaDB.length === 0) {
      await db.insert(provincias).values({ name: objeto.Provincia }).execute();
      provinciaDB = await db
        .select({
          id: provincias.id,
          name: provincias.name,
        })
        .from(provincias)
        .where(eq(provincias.name, objeto.Provincia))
        .execute();
    }

    const provincia = provinciaDB[0];

    // Buscar o crear la subprovincia
    let subprovinciaDB = await db
      .select({
        id: subProvincias.id,
        name: subProvincias.name,
      })
      .from(subProvincias)
      .where(and(eq(subProvincias.name, objeto.SubProvincia), eq(subProvincias.ProvinciumId, provincia!.id))) // Asegúrate de usar provincia.id
      .execute();

    if (subprovinciaDB.length === 0) {
      await db
        .insert(subProvincias)
        .values({
          name: objeto.SubProvincia,
          ProvinciumId: provincia?.id, // Usa provincia.id
        })
        .execute();
      subprovinciaDB = await db
        .select({
          id: subProvincias.id,
          name: subProvincias.name,
        })
        .from(subProvincias)
        .where(and(eq(subProvincias.name, objeto.SubProvincia), eq(subProvincias.ProvinciumId, provincia!.id)))
        .execute();
    }

    const subprovincia = subprovinciaDB[0]; // Asegúrate de que subprovinciaDB tenga al menos un resultado

    // Buscar o crear el partido
    let partidoDB = await db
      .select({
        id: partidos.id,
        name: partidos.name,
      })
      .from(partidos)
      .where(and(eq(partidos.name, objeto.Partido), eq(partidos.SubProvinciumId, subprovincia!.id)))
      .execute();

    if (partidoDB.length === 0) {
      const partidoName = objeto.SubProvincia.includes("Ciudad Autónoma")
        ? objeto.LocalidadCiudad
        : objeto.Partido;

      await db
        .insert(partidos)
        .values({
          name: partidoName,
          SubProvinciumId: subprovincia?.id,
          ProvinciaPartidoId: provincia?.id,
        })
        .execute();

      partidoDB = await db
        .select({
          id: partidos.id,
          name: partidos.name,
        })
        .from(partidos)
        .where(and(eq(partidos.name, partidoName), eq(partidos.SubProvinciumId, subprovincia!.id)))
        .execute();
    }

    const partido = partidoDB[0];

    // Buscar o crear la localidad
    let localidadDB = await db
      .select({
        id: localidades.id,
        name: localidades.name,
      })
      .from(localidades)
      .where(and(eq(localidades.name, objeto.LocalidadCiudad), eq(localidades.PartidoId, partido!.id)))
      .execute();

    if (localidadDB.length === 0) {
      await db
        .insert(localidades)
        .values({
          name: objeto.LocalidadCiudad,
          PartidoId: partido?.id,
          ProvinciaLocalidadId: provincia?.id,
        })
        .execute();
      localidadDB = await db
        .select({
          id: localidades.id,
          name: localidades.name,
        })
        .from(localidades)
        .where(and(eq(localidades.name, objeto.LocalidadCiudad), eq(localidades.PartidoId, partido!.id)))
        .execute();
    }

    const localidad = localidadDB[0];

    // Buscar o crear el barrio
    let barrioDB = await db
      .select({
        id: barrios.id,
        name: barrios.name,
      })
      .from(barrios)
      .where(and(eq(barrios.name, objeto.Barrio), eq(barrios.LocalidadId, localidad!.id)))
      .execute();

    if (barrioDB.length === 0) {
      await db
        .insert(barrios)
        .values({
          name: objeto.Barrio,
          LocalidadId: localidad?.id,
          ProvinciumId: provincia?.id,
          ProvinciaBarrioId: provincia?.id,
        })
        .execute();
    }
  }

  console.timeEnd("Localidades cargadas");
}

export default handleLocations;

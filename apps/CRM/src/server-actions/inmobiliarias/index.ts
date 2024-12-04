"use server";
import db, {
  addresses,
  eq,
  inmobiliarias,
  organizations,
  sql,
  users,
} from "@repo/database/db";

export async function GetAllInmobiliarias() {
  try {
    // Obtener las inmobiliarias con los responsables asociados
    const inmobiliariasWithResponsables = await db
      .select({
        id: inmobiliarias.id,
        inmobiliariaName: inmobiliarias.name,
        inmoAgent: inmobiliarias.inmoAgent,
        responsableName: sql`${users.name} || ' ' || ${users.lastname}`.as(
          "responsableName"
        ),
        responsableEmail: users.email,
        responsableId: users.id,
        inmoCity: addresses.city,
        inmoDomicilio: addresses.domicilio,
        garantiasEnProceso: inmobiliarias.warrantiesInProcess,
        garantiasPerdidas: inmobiliarias.warrantiesLost,
        garantiasGanadas: inmobiliarias.warrantiesWon,
        organizationId: organizations.id,
        organizationName: organizations.type,
        date: inmobiliarias.createdAt,
      })
      .from(inmobiliarias)
      .leftJoin(users, eq(inmobiliarias.responsableId, users.id))
      .leftJoin(organizations, eq(organizations.id, users.organizationId))
      .leftJoin(addresses, eq(inmobiliarias.addressId, addresses.id));

    // Verificar si existen inmobiliarias
    if (inmobiliariasWithResponsables?.length) {
      // Mapear los datos de inmobiliarias a la estructura esperada
      const data = inmobiliariasWithResponsables.map((elem) => ({
        id: elem.id,
        name: elem.inmobiliariaName,
        manager: elem.inmoAgent,
        agent: elem.responsableName as string,
        agentEmail: elem.responsableEmail ?? "No especificado",
        agentId: elem.responsableId,
        city: elem.inmoDomicilio
          ? elem.inmoDomicilio
          : elem.inmoCity
            ? elem.inmoCity
            : "No especificado",
        garantiasGanadas: elem.garantiasGanadas,
        garantiasPerdidas: elem.garantiasPerdidas,
        garantiasEnProceso: elem.garantiasEnProceso,
        organization: elem.organizationName,
        date: elem.date,
      }));
      return data;
    } else {
      throw new Error("Error: No se pudieron obtener las inmobiliarias.");
    }
  } catch (error: any) {
    console.error("Error en GET /inmobiliarias:", error);
    throw new Error("Solicitud: Algo fallo en obtener las inmobiliarias.");
  }
}

export async function getInmo(id: string) {
  try {
    let inmoExist = await db
      .select()
      .from(inmobiliarias)
      .where(eq(inmobiliarias.id, id))
      .leftJoin(users, eq(inmobiliarias.responsableId, users.id))
      .leftJoin(addresses, eq(inmobiliarias.addressId, addresses.id));

    if (!inmoExist) {
      throw Error("Error: Inmobiliaria no encontrado");
    }
    return inmoExist[0];
  } catch (error: any) {
    throw Error(error.message);
  }
}

export type getInmoType = Awaited<ReturnType<typeof getInmo>>;

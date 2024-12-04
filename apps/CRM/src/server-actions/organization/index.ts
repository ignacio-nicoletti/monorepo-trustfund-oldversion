"use server";

import db from "@repo/database/db";

export async function getAllOrganizations() {
  try {
    const organizationsFound = await db.query.organizations.findMany()
    if (organizationsFound) {
  
      return organizationsFound;
    } else {
      throw Error("Error: organizaciones no encontradas");
    }
  } catch (error: any) {
    throw Error(error.message);
  }
}

export type AllOrganizations = Awaited<ReturnType<typeof getAllOrganizations>>;
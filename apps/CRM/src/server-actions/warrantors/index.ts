"use server";

import db, { and, ilike, ne, warrantors } from "@repo/database/db";

export async function getAllUnavailableWarrantors(searchTerm: string) {
  try {
    const availableWarrantor = await db.query.warrantors.findFirst({
      where: and(
        ilike(warrantors.fullname, `%${searchTerm}%`),
        ne(warrantors.isOwner, true)
      ),
      columns: {
        id: true,
        fullname: true,
        availability: true,
      },
    });

    if (availableWarrantor?.availability) {
      return "Usuario disponible";
    } else if (!availableWarrantor) {
      return "Usuario no existe";
    } else {
      return "Usuario no disponible";
    }
  } catch (error: any) {
    throw Error(error.message);
  }
}

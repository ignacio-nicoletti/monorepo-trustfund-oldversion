"use server";

import db, { eq, statusWarranty, warranties } from "@repo/database/db";

export async function changeFormStatus(formData: FormData) {
  try {
    const statusWarrantyId = Number(formData.get("id"));
    const warrantyId = formData.get('warrantyId') as string 

    const newStatusWarranty = await db.query.statusWarranty.findFirst({
      where: eq(statusWarranty.id, statusWarrantyId),
      columns: {
        createdAt: false, 
        updatedAt: false
      }
    });

    if (newStatusWarranty?.id) {
      const updatedWarranty = await db
        .update(warranties)
        .set({ statusWarrantyId: newStatusWarranty.id })
        .where(eq(warranties.id, warrantyId))
        .returning();

        if(updatedWarranty[0]?.id) {
          return {
            warranty: updatedWarranty[0],
            statusWarranty: newStatusWarranty
          }
        } else {
          throw Error("Error: No se pudo actualizar el estado del formulario.")
        }
    } else {
      throw Error("Error: No existe el estado para actualizar.")
    }
  } catch (error: any) {
    throw Error(error.message)
  }
}

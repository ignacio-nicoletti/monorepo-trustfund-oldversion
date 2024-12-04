"use server";

import db, { eq, warranties, users, inmobiliarias } from "@repo/database/db";

export async function changeFormStatus(id: string, statusId: number, userId?: string, realStateId?: string | null) {
  try {
    if (!statusId || statusId === null) {
      return {
        status: 400,
        message: "Elija un estado ❌",
      };
    } else if (statusId === 7) {
      const updatedWarranty = await db
        .update(warranties)
        .set({
          statusWarrantyId: statusId,
        })
        .where(eq(warranties.id, id))
        .returning();

      if (updatedWarranty[0]?.statusWarrantyId && userId && realStateId) {
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        const realState = await db.query.inmobiliarias.findFirst({
          where: eq(inmobiliarias.id, realStateId)
        })

        if (user?.id && realState?.id) {
          const updatedUser = await db
            .update(users)
            .set({ warrantiesWon: user.warrantiesWon ? user.warrantiesWon+= 1 : 1 })
            .where(eq(users.id, userId))
            .returning();

          const updatedRealState = await db
            .update(inmobiliarias)
            .set({ warrantiesWon: realState.warrantiesWon ? realState.warrantiesWon+= 1 : 1 })
            .where(eq(inmobiliarias.id, realStateId))
            .returning();

          if (updatedUser[0]?.id && updatedRealState[0]?.id) {
            return {
              status: 200,
              message: "Estado cambiado correctamente ✅",
            };
          } else {
            throw Error("Solcitud: No se pudo actualizar la venta para el asesor ❌");
          }
        } else {
          return {
            status: 404,
            message: "Error: Asesor no encontrado ❌",
          };
        }
      } else {
        return {
          status: 404,
          message: "Error: Garantía no encontrada ❌",
        };
      }
    } else if(statusId === 8) {
      const updatedWarranty = await db
        .update(warranties)
        .set({
          statusWarrantyId: statusId,
        })
        .where(eq(warranties.id, id))
        .returning();

      if (updatedWarranty[0]?.statusWarrantyId && userId) {
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (user?.id) {
          const updatedUser = await db
            .update(users)
            .set({ warrantiesInProcess: user.warrantiesInProcess ? user.warrantiesInProcess-= 1 : 0 })
            .where(eq(users.id, userId))
            .returning();

          if (updatedUser[0]?.id) {
            return {
              status: 200,
              message: "Estado cambiado correctamente ✅",
            };
          } else {
            throw Error("Solicitud: No se pudo actualizar la venta para el asesor ❌");
          }
        } else {
          return {
            status: 404,
            message: "Asesor no encontrado ❌",
          };
        }
      } else {
        return {
          status: 404,
          message: "Garantía no encontrada ❌",
        };
      }
    } else {
      const updatedWarranty = await db
        .update(warranties)
        .set({
          statusWarrantyId: statusId,
        })
        .where(eq(warranties.id, id))
        .returning();

      if (updatedWarranty[0]?.statusWarrantyId) {
        return {
          status: 200,
          message: "Estado cambiado correctamente ✅",
        };
      } else {
        return {
          status: 404,
          message: "Garantía no encontrada ❌",
        };
      }
    }
  } catch (error) {
    console.error(error);
    throw Error("Solicitud: No se pudo cambiar el estado de la cuota");
  }
}

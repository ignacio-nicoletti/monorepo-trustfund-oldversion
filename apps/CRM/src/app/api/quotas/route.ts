import { NextResponse, NextRequest } from "next/server";

import db, { and, eq, quotas, warrantors } from "@repo/database/db";
import { InferQuota } from "@repo/database/types";
import { months } from "~/src/utils/month";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const createdQuotas: InferQuota[] = [];

    let requester = await db
      .select({
        id: warrantors.id,
        driveFolderId: warrantors.driveFolderId,
        folderName: warrantors.folderName,
        isRequester: warrantors.isRequester,
        warrantyId: warrantors.warrantyId,
      })
      .from(warrantors)
      .where(
        and(
          eq(warrantors.warrantyId, data.warrantyId),
          eq(warrantors.isRequester, true)
        )
      );

    for (const quota of data.quotas) {
      // Iniciar la transacción
      await db.transaction(async (tx) => {
        // Crear la nueva quota

        let monthStr = months[new Date(quota.expiration).getMonth()];

        let amountNumber = parseInt(quota.amount);

        let newQuota = await tx
          .insert(quotas)
          .values({
            numberOfQuota: quota.numberOfQuota, // Número de cuotas
            amount: amountNumber, // Monto
            month: monthStr,
            expiration: quota.expiration, // Fecha de expiración
            status: quota.status?.length ? quota.status : "Pendiente", // Estado de la cuota
            paidPreviously: quota.paidPreviously, // Indica si fue pagada previamente
            driveFolderId: requester[0]?.driveFolderId ? requester[0]?.driveFolderId : null,
            folderName:requester[0]?.folderName ? requester[0]?.folderName : null,
            warrantyId: data.warrantyId,
          })
          .returning();
        // Verificar que el warrantor fue creada
        if (!newQuota[0]?.id) {
          throw new Error("Error al crear las cuotas");
        }

        if (newQuota[0]?.id) {
          createdQuotas.push(newQuota[0]);
        }
      });
    }

    if (createdQuotas?.length) {
      // Devolver los garantes creados
      return NextResponse.json({ quotas: createdQuotas }, { status: 201 });
    }

    // Si por alguna razón no se crea el usuario
    return NextResponse.json("No se pudo crear las quotas", { status: 400 });
  } catch (error: any) {
    console.error("Error in POST /quotas:", error);
    return NextResponse.json(`An unexpected error occurred. ${error.message}`, {
      status: 500,
      statusText: "Internal server error",
    });
  }
}

"use server";

import db, { addresses, currencyTypes, eq, gte, organizations, quotas, users, warranties } from "@repo/database/db";
import capitalize from "~/src/utils/capitalizeWord";

type Status = "Pago" | "Pendiente" | "Deuda";

type MarkAsPaidData = {
  expiration: string;
  amount: number;
};

export async function markAsPaid(id: string, status: Status, quotaData?: MarkAsPaidData) {
  const defaultMonth = capitalize(
    new Date(quotaData?.expiration!).toLocaleDateString("es-ES", {
      month: "long",
    })
  );

  // Validación de los datos
  if (!status) {
    return {
      status: 400,
      message: "Elija un estado ❌",
    };
  }

  if (!quotaData?.expiration || isNaN(Date.parse(quotaData?.expiration))) {
    return {
      status: 400,
      message: "La fecha de vencimiento no es válida ❌",
    };
  }

  if (quotaData.amount <= 0) {
    return {
      status: 400,
      message: "El monto debe ser mayor a cero ❌",
    };
  }

  try {
    // Actualización de la cuota en la base de datos
    const updatedQuota = await db
      .update(quotas)
      .set({
        status,
        expiration: quotaData.expiration, // Aseguramos que sea un Date válido
        month: defaultMonth, //Nombre del mes
        amount: quotaData.amount,
      })
      .where(eq(quotas.id, id))
      .returning();

    if (updatedQuota[0]?.status) {
      return {
        status: 200,
        message: "Cuota actualizada correctamente ✅",
      };
    } else {
      return {
        status: 404,
        message: "Error: Cuota no encontrada ❌",
      };
    }
  } catch (error) {
    console.error("Error al actualizar la cuota:", error);
    return {
      status: 500,
      message: "Error interno del servidor ❌",
    };
  }
}

export async function GetAllQuotas(financingType: number) {
  try {
    let rawQuotasData = await db
      .select({
        id: quotas.id,
        paidPreviously: quotas.paidPreviously,
        amount: quotas.amount,
        month: quotas.month,
        numberOfQuota: quotas.numberOfQuota,
        expiration: quotas.expiration,
        status: quotas.status,
        interest: quotas.interest,
        warrantyId: quotas.warrantyId,
        createdAt: quotas.createdAt,
        updatedAt: quotas.updatedAt,
        financingType: warranties.financingTypeId,
        sucursal: addresses.province,
        currency: currencyTypes.type,
        organization: organizations.type,
      })
      .from(quotas)
      .leftJoin(warranties, eq(warranties.id, quotas.warrantyId))
      .leftJoin(currencyTypes, eq(warranties.currencyTypeId, currencyTypes.id))
      .leftJoin(users, eq(warranties.userId, users.id))
      .leftJoin(organizations, eq(organizations.id, users.organizationId))
      .leftJoin(addresses, eq(users.addressId, addresses.id))
      .where(
        financingType === 1
          ? eq(warranties.financingTypeId, financingType)
          : gte(warranties.financingTypeId, financingType)
      );

    // Sort the data by expiration year and month to ensure correct ordering
    rawQuotasData.sort((a, b) => {
      const dateA = new Date(a.expiration!);
      const dateB = new Date(b.expiration!);

      // Compare by year first, and if equal, compare by month
      return dateA.getFullYear() - dateB.getFullYear() || dateA.getMonth() - dateB.getMonth();
    });

    // Transforming the raw data into the desired grouped structure
    let groupedData;

    // Calculate the total for all quotas if financingType is 1
    const total = rawQuotasData.reduce((acc, quota) => acc + quota.amount!, 0);

    const plusYear = rawQuotasData.map((quota) => {
      return {
        ...quota,
        year: quota.expiration ? new Date(quota.expiration).getUTCFullYear() : null,
        
      };
    });

    groupedData = {
      quotas: plusYear,
      total,
    };

    if (groupedData) {
      return groupedData;
    }

    throw new Error("Error: No se pudieron obtener las cuotas.");
  } catch (error: any) {
    console.error("Error in GET /quotas:", error);
    return "No se pudieron obtener las inmobiliarias.";
  }
}

export async function GetAllQuotasByWarranty(id: string) {
  try {
    let rawQuotasData = await db
      .select({
        id: quotas.id,
        paidPreviously: quotas.paidPreviously,
        amount: quotas.amount,
        month: quotas.month,
        numberOfQuota: quotas.numberOfQuota,
        expiration: quotas.expiration,
        status: quotas.status,
        interest: quotas.interest,
        warrantyId: quotas.warrantyId,
        receiptPayment: quotas.receiptPayment,
        proofPayment: quotas.proofPayment,
        folderName: quotas.folderName,
        driveFolderId: quotas.driveFolderId,
        createdAt: quotas.createdAt,
        updatedAt: quotas.updatedAt,
      })
      .from(quotas)
      .where(eq(quotas.warrantyId, id));

    let currencyType = null;

    if (rawQuotasData[0]?.warrantyId) {
      let warranty = await db
        .select({
          id: warranties.id,
          currencyType: currencyTypes.type,
        })
        .from(warranties)
        .where(eq(warranties.id, rawQuotasData[0]!.warrantyId!))
        .leftJoin(currencyTypes, eq(currencyTypes.id, warranties.currencyTypeId));

      currencyType = warranty[0]?.currencyType;
    }

    if (rawQuotasData) {
      return currencyType ? rawQuotasData.map((elem) => ({ ...elem, currency: currencyType })) : rawQuotasData;
    }
    throw new Error("Error: No se pudieron obtener las cuotas.");
  } catch (error: any) {
    console.error("Error in GET /quotas:", error);
    return "Solicitud: No se pudieron obtener las inmobiliarias.";
  }
}

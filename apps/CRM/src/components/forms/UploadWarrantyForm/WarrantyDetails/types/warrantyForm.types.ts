import { z } from "zod";
import { quotaSchema, warrantyDetailsSchema } from "../validations/warrantyDetailsFormValidation";

export interface CalculatingPaymentsProps {
  valorReserva: number;// Puede ser número o cadena, para permitir la conversión
  totalGarantia: number; // Puede ser número o cadena, para permitir la conversión
  cuotas: string | number; // Cantidad de cuotas (o "Contado")
  reservationDate: string; // Fecha de inicio del contrato, que puede ser una cadena o Date
}

export type Quota = {
  numberOfQuota: number | undefined;
  amount: number | undefined;
  expiration: string | undefined;
  status:"Pendiente" | "Pago" | "Deuda";
  paidPreviously: boolean;
}

export type WarrantyDetails = z.infer<typeof warrantyDetailsSchema>

export type CalculatingPaymentsResult = Array<z.infer<typeof quotaSchema>> | { message: string };

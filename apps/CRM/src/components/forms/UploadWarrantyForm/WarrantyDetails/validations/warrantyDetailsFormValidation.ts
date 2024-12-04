import { z } from "zod";

const document = z
  .object({
    id: z.string().optional(),
    type: z.number().optional(),
    url: z.string().optional(),
    name: z.string().optional(),
  })
  .optional();

export const quotaSchema = z.object({
  id: z.string().optional(),
  numberOfQuota: z.number().optional(), // Número de cuotas
  amount: z.number().optional(), // Monto
  expiration: z.string().datetime().optional(), // Fecha de expiración
  status: z.enum(["Pendiente", "Pago", "Deuda"]).optional(), // Estado de la cuota
  paidPreviously: z.boolean().default(false), // Indica si fue pagada previamente
});

export const warrantyDetailsSchema = z
  .object({
    reservationAmount: z.string().optional(),
    warrantyAmount: z.string().optional(),
    warrantyAmountLessReservation: z.string().optional(),
    contractDuration: z.string().optional(),
    financingTypeId: z.string().optional(),
    currencyTypeId: z.string().optional(),
    dollarTypeId: z.string().optional(),
    warrantyTypeId: z.string().optional(),
    coverageTypeId: z.string().optional(),
    contractInitDate: z.string().datetime({ message: "Ingrese fecha de inicio" }),
    contractEndDate: z.string().datetime({ message: "Ingrese fecha de finalización" }),
    reservationDate: z.string().datetime({ message: "Ingrese fecha de reserva" }),
    userId: z.string().optional(),

    // Direcciones
    province: z.string().optional(),
    city: z.string().optional(),
    street: z.string().optional(),
    intersectionOne: z.string().optional(),
    intersectionTwo: z.string().optional(),
    number: z.string().optional(),
    postal_code: z.string().optional(),
    quotas: z.array(quotaSchema).optional(), // Definición del array de cuotas
    documentsData: z.array(document).optional().nullish(),
    statusWarrantyId: z.number().optional(),
  })
  .refine(
    (data) => new Date(data.contractInitDate).getTime() < new Date(data.contractEndDate).getTime(),
    {
      message: "La fecha de finalización debe ser posterior a la fecha de inicio",
      path: ["contractEndDate"], // Campo donde se marcará el error
    }
  );

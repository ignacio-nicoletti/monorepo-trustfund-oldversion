import { z } from "zod";

// Esquema para el tipo de documento
const document = z.object({
  id: z.string().optional(),
  url: z.string().optional(),
  type: z.number().optional(),
  name: z.string().optional(),
}).optional();

// Esquema para cada solicitante o garante
export const applicantDataSchema = z.object({
  id: z.string().nullish().optional(),
  addressId: z.string().nullish().optional(),
  name: z.string().nullish().optional(),
  lastname: z.string().nullish().optional(),
  email: z.string().nullish().optional(),
  phone: z.string().nullish().optional(),
  dni: z.string().nullish().optional(),
  nacionality: z.string().nullish(),
  isRequester: z.boolean().optional(),
  isOwner: z.boolean().optional(),
  province: z.string().nullish().optional(),
  city: z.string().nullish().optional(),
  street: z.string().nullish().optional(),
  intersectionOne: z.string().nullish(),
  intersectionTwo: z.string().nullish().optional(),
  number: z.string().nullish().optional(),
  postal_code: z.string().nullish().optional(),
  driveFolderId: z.string().nullish().optional(),
  documentsData: z.array(document).optional(),
});

// Esquema principal para `warrantorsSchema`, que será un array de `applicantDataSchema`
export const warrantorsSchema = z.object({
  warrantors: z.array(applicantDataSchema),
});

export type TWarrantorsSchema = z.infer<typeof warrantorsSchema>
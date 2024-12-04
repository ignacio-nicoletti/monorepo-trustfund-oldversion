import { z } from "zod";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const WarrantyFormSchema = z.object({
  rentValue: z.string(),
  expenses: z.string(),
  rentType: z.string(),
  duration: z.string(),
});
export const WarrantyRequestFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe contener al menos dos caracteres." }),
  lastname: z
    .string()
    .min(2, { message: "El apellido debe contener al menos dos caracteres." }),
  email: z.string().regex(emailRegex, { message: "El email debe ser válido" }),
  dni: z.string(),
  phone: z
    .string()
    .min(8, { message: "El número debe contener al menos 8 caracteres." })
    .max(15, { message: "El número debe contener 12 caracteres como máximo." }),
  location: z.string(),
});
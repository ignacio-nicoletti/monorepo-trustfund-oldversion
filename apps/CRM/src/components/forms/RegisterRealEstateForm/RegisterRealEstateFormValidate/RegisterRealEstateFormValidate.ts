import { z } from "zod";

const phoneRegex = /^(?:[1-9]\d{1,4})[1-9]\d{5,7}$/g;

// Esquema para el formulario de registro
export const registerFormSchema = z.object({
  // nombre de asesor
  inmoAgent: z
    .string()
    .optional(),
    // nombre de inmobiliaria
  name: z
    .string()
    .min(2, { message: "El nombre debe contener al menos dos caracteres." }),
    // nombre del responsable
  responsableId: z
    .string()
    .min(2, { message: "El nombre debe contener al menos dos caracteres." }),
    // debe ser opcional
  phone: z.string().regex(phoneRegex, {
    message: "Por favor, ingresá el número sin +, 0 o 9 al inicio.",
  }).optional(),
  email: z
  .string()
  .email({ message: "Por favor, ingresá un correo electrónico válido." })
  .optional()
  .refine((value) => !value || z.string().email().safeParse(value).success, {
    message: "Por favor, ingresá un correo electrónico válido.",
  }),
  web: z.string().optional(),
  comment: z.string().optional(),
  // Addreses
  province: z.string().min(2, { message: "Ingrese la localidad." }),
  localidad: z.string().optional(),
  street: z.string().min(1, { message: "Ingrese la calle." }),
  intersectionOne: z.string().min(1, { message: "Ingrese la intersección." }),
  number: z.string().optional(),
  intersectionTwo: z.string().optional(),
  postal_code: z.string().optional(),
});

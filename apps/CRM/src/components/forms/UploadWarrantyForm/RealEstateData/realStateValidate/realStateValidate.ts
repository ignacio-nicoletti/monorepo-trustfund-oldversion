import { z } from "zod";

// Regex para control de inputs con caracteres especiales
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phoneRegex = /^(?:[1-9]\d{1,4})[1-9]\d{5,7}$/g;

// });
export const RealStateValidateFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Debe ingresar el nombre de la inmobiliaria" }),
  inmoAgent: z.string().min(2, { message: "Debe ingresar el nombre de un contacto" }),
  email: z
    .string()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Por favor, ingresá un correo electrónico válido.",
    }),
  phone: z
    .string()
    .regex(phoneRegex, {
      message: "Por favor, ingresá el número sin +, 0 o 9 al inicio.",
    })
    .optional(),
  country: z.string().optional(),
  province: z.string().min(2, { message: "Debe ingresar una provincia." }),
  city: z.string().optional(),
  // state: z.string().optional(),
  apartment: z.string().optional(),
  street: z.string().min(1, { message: "Debe ingresar una calle" }),
  intersectionOne: z.string(),
  intersectionTwo: z.string().optional(),
  number: z.string().optional(),
  postal_code: z.string().optional(),
});

export type TRealStateValidateFormSchema = z.infer<typeof RealStateValidateFormSchema>;

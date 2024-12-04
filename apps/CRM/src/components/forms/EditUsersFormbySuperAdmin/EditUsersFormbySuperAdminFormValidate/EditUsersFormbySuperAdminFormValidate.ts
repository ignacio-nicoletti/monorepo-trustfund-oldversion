import { z } from "zod";


const sellerRegex = /^\d+$/g

export const EditUsersFormbySuperAdminFormSchema = z.object({
  role: z
    .string()
    .nonempty({ message: "Debe seleccionar una opción" })
    .refine((val) => ["1", "2", "3"].includes(val), {
      message: "Debe seleccionar una opción válida",
    }),
  name: z.string().min(2, { message: "El nombre debe contener al menos dos caracteres." }),
  lastname: z.string().min(2, { message: "El apellido debe contener al menos dos caracteres." }),
  organization: z
    .string()
    .refine((val) => ["1", "2"].includes(val), {
      message: "Debe seleccionar una organización válida",
    }),
  image_profile: z.string().optional(),
  email: z.string().email({ message: "El email debe ser válido" }),
  warrantiesWon: z.string().regex(sellerRegex, "Solo puede ingresar números")
});

import { z } from "zod";

// Regex para control de inputs con caracteres especiales
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;

export const editUserFormSchema = z
  .object({
    image_profile: z.string().optional(),
    email: z.string().optional(),
    password: z.string().regex(passwordRegex, { message: "La contraseña debe tener al menos 8 caracteres, incluyendo como mínimo una mayúscula, una minúscula, un número y un símbolo especial." }).optional(),
    confirmPassword: z.string().regex(passwordRegex, { message: "La contraseña debe tener al menos 8 caracteres, incluyendo como mínimo una mayúscula, una minúscula, un número y un símbolo especial." }).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Campo donde ocurrirá el error si no coinciden
    message: "Las contraseñas no coinciden",
  });

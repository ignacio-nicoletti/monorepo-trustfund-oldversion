import { z } from "zod";

// Regex para control de inputs con caracteres especiales
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
const phoneRegex = /^(?:[1-9]\d{1,4})[1-9]\d{5,7}$/g;
// Esquema para el formulario de registro
// Contiene: Tipo de usuario - name - Lastaname - phone - email - password.
// Control y mensaje de error.

export const registerFormSchema = z.object({
  role: z.enum(["Responsable", "Administrativo", "Super Admin"], {
    message: "Debe seleccionar una opción",
  }),
  name: z
    .string()
    .min(2, { message: "El nombre debe contener al menos dos caracteres." }),
  lastname: z
    .string()
    .min(2, { message: "El apellido debe contener al menos dos caracteres." }),
  organization: z.enum(["Trust Fund", "OKcred"], {
    message: "Ingrese una organización",
  }),
  image_profile: z.string().optional(),
  email: z.string().email({ message: "El email debe ser válido" }),
  password: z
    .string()
    .regex(passwordRegex, {
      message:
        "La contraseña debe tener al menos 8 caracteres, incluyendo como mínimo una mayúscula, una minúscula, un número y un símbolo especial.",
    }),
    // Addreses
  province: z.string().min(2, { message: "Ingrese la provincia." }),
  city: z.string().optional(),
  street: z.string().min(1, { message: "Ingrese la calle." }),
  intersectionOne: z.string().min(1, { message: "Ingrese la interseccion uno." }),
  intersectionTwo: z.string().optional(),
  number: z.string().optional(),
  postal_code: z.string().optional(),
});
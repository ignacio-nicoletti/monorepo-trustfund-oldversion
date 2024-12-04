import { z } from "zod";

// Regex para control de inputs con caracteres especiales
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;

export const ForgotPassFormSchema = z
  .object({
    password: z
      .string()
      .regex(passwordRegex, { message: "La contraseña debe tener al menos 8 caracteres, incluyendo como mínimo una mayúscula, una minúscula, un número y un símbolo especial." }),
    passwordConfirmation: z
      .string()
      .regex(passwordRegex, { message: "La contraseña debe tener al menos 8 caracteres, incluyendo como mínimo una mayúscula, una minúscula, un número y un símbolo especial." }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Las contraseñas deben ser iguales",
  });

  export const OTPSchema = z.object({
    otpInput: z.string()
  })

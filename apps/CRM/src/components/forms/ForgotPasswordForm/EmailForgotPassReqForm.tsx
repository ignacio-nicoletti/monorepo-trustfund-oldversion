import { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { Input } from "@repo/ui/components/ui/input.tsx";
import { Label } from "@repo/ui/components/ui/label.tsx";

// Definir un esquema de validación para el email
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const emailSchema = z.string().regex(emailRegex, { message: "El email debe ser válido" });

interface EmailForgotPassReqFormProps {
  emailValue: string;
  setEmailValue: Dispatch<SetStateAction<string>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

const EmailForgotPassReqForm: React.FC<EmailForgotPassReqFormProps> = ({
  emailValue,
  setEmailValue,
  error,
  setError,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Validar el email con zod
    const result = emailSchema.safeParse(value);

    setEmailValue(value);

    if (!result.success) {
      // Si no pasa la validación, establecer el mensaje de error
      setError(result?.error?.errors[0]?.message ?? null);
    } else {
      // Si pasa la validación, actualizar el valor del email y limpiar errores
      setError(null);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 flex-col">
      <Label htmlFor="password" className="text-start flex w-full text-foreground">
        Ingresa tu Email
      </Label>
      <Input
        type="email"
        value={emailValue}
        onChange={handleInputChange}
        placeholder="Ingresa tu email..."
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default EmailForgotPassReqForm;
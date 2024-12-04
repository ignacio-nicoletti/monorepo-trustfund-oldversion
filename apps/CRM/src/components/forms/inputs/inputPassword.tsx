"use client";
import React, { useState } from "react";
import { Input } from "@repo/ui/components/ui/input.tsx";
interface Props {
  icons: Record<string, Icons>;
  value: string;
  id: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
}
interface Icons {
  src: string;
  height: number;
  width: number;
  blurHeight: number;
  blurWidth: number;
}
const InputPassword: React.FC<Props> = ({ icons, id, value, onChange, required = true }: Props) => {
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar la visibilidad de la contraseña

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      <Input
        type={showPassword ? "text" : "password"} // Alternar el tipo de input entre "text" y "password" para hacer visible el password
        placeholder="Ingrese su contraseña"
        required={required}
        className="pr-10 border border-primary/30"
        value={value} // Agregado: valor proveniente de react-hook-form
        onChange={onChange} // Agregado: manejar cambios de valor
        id={id}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        {showPassword ? (
          <img alt="icon eyeSlash" src={icons?.eyeSlash?.src} className="h-5 w-5 text-gray-500" />
        ) : (
          <img alt="icon eye" src={icons?.eye?.src} className="h-5 w-5 text-gray-500" />
        )}
      </button>
    </div>
  );
};

export default InputPassword;

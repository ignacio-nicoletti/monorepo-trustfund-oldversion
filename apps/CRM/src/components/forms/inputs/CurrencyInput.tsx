"use client";

import { Input } from "@repo/ui/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select.tsx";

interface CurrencyOption {
  value: string;
  label: string;
}

interface CurrencyInputProps {
  id: string;
  value: string;
  currency: string;
  onValueChange: (value: string) => void;
  onCurrencyChange: (currency: string) => void;
  currencyOptions?: CurrencyOption[];
  placeholder?: string;
}

export function CurrencyInput({
  value,
  id,
  currency,
  onValueChange,
  onCurrencyChange,
  currencyOptions = [
    { value: "ARS", label: "ARS" },
    { value: "USD", label: "USD" },
  ],
  placeholder = "Valor de la Reserva",
}: CurrencyInputProps) {
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, ""); // Elimina caracteres no numéricos
    const number = parseFloat(numericValue) || 0;
    return new Intl.NumberFormat("es-AR").format(number); // Formatea el número
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ""); // Elimina comas para el manejo interno
    const formattedValue = formatNumber(rawValue);
    onValueChange(formattedValue); // Pasa el valor formateado
  };

  return (
    <div className="flex rounded-md bg-primary/15 border border-primary/30">
      <Select value={currency} onValueChange={onCurrencyChange}>
        <SelectTrigger className="w-auto border-0 focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          {currencyOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        id={id}
        type="text" // Cambia a texto para manejar mejor la entrada
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-1"
      />
    </div>
  );
}

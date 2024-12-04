import { cn } from "../../utils/index";
import * as React from "react";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  value?: string; // El valor actual del textarea
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>; // Función para manejar cambios
  placeholder?: string; // Texto de marcador
  maxLength?: number; // Longitud máxima permitida
  rows?: number; // Número de filas visibles
  disabled?: boolean; // Deshabilitar el textarea
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, onChange, placeholder, maxLength, rows, disabled, ...props }, ref) => {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        disabled={disabled}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };

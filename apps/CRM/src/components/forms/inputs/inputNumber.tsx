import { cn } from "@repo/ui/lib/utils";
import { Input } from "@repo/ui/components/ui/input.tsx";

interface Props {
  placeHolder?: string;
  maxLength?: number;
  type?: string;
  value?: string | number | undefined;
  className?: string;
  name?: string;
  id?: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
}

function InputNumber({
  placeHolder,
  maxLength,
  value,
  onChange,
  type = "text",
  className,
  id = "id",
  name = "name",
  isRequired = false,
}: Props) {
  return (
    <Input
      type={type}
      placeholder={placeHolder ? placeHolder : "Número"}
      className={cn("appearance-none", className)}
      value={value ?? ""}
      onChange={onChange}
      onKeyDown={(e) => {
        // Evita la entrada de caracteres no numéricos
        if (
          !/[0-9]/.test(e.key) &&
          e.key !== "Backspace" &&
          e.key !== "Delete" &&
          e.key !== "ArrowLeft" &&
          e.key !== "ArrowRight"
        ) {
          e.preventDefault();
        }
      }}
      id={id}
      name={name}
      // inputMode="numeric"
      maxLength={maxLength}
    />
  );
}

export default InputNumber;

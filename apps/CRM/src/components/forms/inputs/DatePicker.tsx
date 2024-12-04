"use client";

import { Button } from "@repo/ui/components/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover.tsx";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@repo/ui/components/ui/calendar.tsx";

interface Props {
  placeHolder?: string;
  maxLength?: number;
  type?: string;
  value?: string | number | undefined;
  className?: string;
  name?: string;
  id?: string;
  setDateValue?: any;
  isRequired?: boolean;
}

export function DatePicker({ setDateValue, placeHolder }: Props) {
  const [date, setDate] = useState<Date>();
  //Formatear la data a ISO 8601 que es la validacion de ZOD
  function formatDate(newDate: any) {
    setDate(newDate);
    setDateValue(newDate?.toISOString() || "");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            " justify-start text-left font-normal bg-primary/15 w-full border border-primary/30 hover:bg-primary/30 text-ellipsis truncate tex"
            // date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: es })
          ) : (
            <span>{placeHolder || "Selecciona una fecha"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            formatDate(newDate);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

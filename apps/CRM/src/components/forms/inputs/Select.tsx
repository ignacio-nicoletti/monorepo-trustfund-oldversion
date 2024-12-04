"use client";

import { cn } from "@repo/ui/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select.tsx";

type Item = {
  id: number;
  type: string | null;
};

type CustomSelectProps = {
  items: Item[] | undefined;
  className?: string;
  onChange?: (value: string) => void;
  selected?: Item | undefined;
};

export default function CustomSelect({ items, className, onChange, selected}: CustomSelectProps) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className={cn("w-full bg-primary/15 border border-primary/30", className)}>
        <SelectValue placeholder="Elige un estado" className="text-slate-400!" />
      </SelectTrigger>
      <SelectContent>
        {items &&
          items.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {item.type}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

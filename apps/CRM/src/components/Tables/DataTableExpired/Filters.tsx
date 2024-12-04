import React, { useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@repo/ui/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select.tsx";
import { DataTableViewOptions } from "../ExtraComponents/ColumnToggle";

type FilterOption = {
  column: string;
  type: "text" | "select" | string;
  placeholder: string;
  options?: string[] | number[];
  defaultValue?: string | number;
};

type TableFiltersProps<TData> = {
  table: Table<TData>;
  filters: FilterOption[];
  className?: string;
};

export default function TableFilters<TData>({
  table,
  filters,
  className = "",
}: TableFiltersProps<TData>) {
  useEffect(() => {
    filters.forEach((filter) => {
      if (filter.defaultValue) {
        table.getColumn(filter.column)?.setFilterValue(filter.defaultValue);
      }
    });
  }, []);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 w-full gap-2 items-center p-2 bg-primary/15 rounded-tr-md rounded-tl-md border-t border-r border-l ${className}`}
    >
      {filters.map((filter) => (
        <React.Fragment key={filter.column}>
          {filter.type === "text" && (
            <Input
              placeholder={filter.placeholder}
              value={
                (table.getColumn(filter.column)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(filter.column)
                  ?.setFilterValue(event.target.value)
              }
              className="w-full h-auto bg-white placeholder:text-secondary-foreground border border-primary"
            />
          )}
          {filter.type === "select" && filter.options && (
            <Select
              onValueChange={(value) =>
                value !== "todos"
                  ? table.getColumn(filter.column)?.setFilterValue(value)
                  : table.getColumn(filter.column)?.setFilterValue("")
              }
              value={
                (table.getColumn(filter.column)?.getFilterValue() as string) ??
                ""
              }
              defaultValue={filter.defaultValue?.toString()}
            >
              <SelectTrigger className="w-full h-auto bg-white placeholder:text-secondary-foreground border border-primary">
                <SelectValue
                  placeholder={
                    (table
                      .getColumn(filter.column)
                      ?.getFilterValue() as string) || filter.placeholder
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filter.placeholder !== "Moneda" && (
                  <SelectItem value="todos">Todos</SelectItem>
                )}
                {filter.options.map((option) => (
                  <SelectItem key={option} value={option?.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </React.Fragment>
      ))}

      {/* Spacer divs */}
      {[...Array(Math.max(0, 11 - filters.length))].map((_, i) => (
        <div key={`spacer-${i}`}></div>
      ))}

      <DataTableViewOptions table={table} />
    </div>
  );
}

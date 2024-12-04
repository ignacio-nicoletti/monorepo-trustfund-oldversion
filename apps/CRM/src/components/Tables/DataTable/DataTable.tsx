"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table.tsx";

import { Input } from "@repo/ui/components/ui/input.tsx";
import { DataTablePagination } from "../ExtraComponents/Pagination";
import { useMemo, useState } from "react";
import { DataTableViewOptions } from "../ExtraComponents/ColumnToggle";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const agentOptions = useMemo(() => {
    return Array.from(new Set(data.map((item: any) => item?.agent ?? null)));
  }, [data]);
  const orgOptions = useMemo(() => {
    return Array.from(
      new Set(data.map((item: any) => item?.organization ?? null))
    );
  }, [data]);

  return (
    <>
      <div className="flex flex-col w-full gap-2 items-center md:flex-row p-2 bg-primary/15 rounded-tr-md rounded-tl-md border-t border-r border-l">
        {table?.getColumn("agent") ? (
          <>
            <Input
              placeholder="Buscar inmo..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("name")?.setFilterValue(event.target.value);
              }}
              className="w-full md:max-w-[15%] h-auto bg-white placeholder:text-secondary-foreground border border-primary"
            />

            <Input
              placeholder="Buscar asesor..."
              value={
                (table.getColumn("manager")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("manager")?.setFilterValue(event.target.value);
              }}
              className="w-full md:max-w-[15%] h-auto bg-white placeholder:text-secondary-foreground border border-primary"
            />

            <Input
              placeholder="Buscar localidad..."
              value={
                (table.getColumn("city")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("city")?.setFilterValue(event.target.value);
              }}
              className="w-full md:max-w-[15%] h-auto bg-white placeholder:text-secondary-foreground border border-primary"
            />

            <Select
              onValueChange={(value) =>
                value !== "todos"
                  ? table.getColumn("agent")?.setFilterValue(value)
                  : table.getColumn("agent")?.setFilterValue("")
              }
              value={
                (table.getColumn("agent")?.getFilterValue() as string) ??
                ""
              }
            >
              <SelectTrigger className="w-full md:max-w-[15%] h-auto bg-white placeholder:text-secondary-foreground border border-primary">
                <SelectValue
                  placeholder={
                    (table
                      .getColumn("agent")
                      ?.getFilterValue() as string) ||
                    "Filtrar por responsable"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los responsables</SelectItem>
                {agentOptions.map((agent) => (
                  <SelectItem key={agent} value={agent}>
                    {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {orgOptions?.length > 1? <Select
              onValueChange={(value) =>
                value !== "todos"
                  ? table.getColumn("organization")?.setFilterValue(value)
                  : table.getColumn("organization")?.setFilterValue("")
              }
              value={
                (table.getColumn("organization")?.getFilterValue() as string) ??
                ""
              }
            >
              <SelectTrigger className="w-full md:max-w-[15%] h-auto bg-white placeholder:text-secondary-foreground border border-primary">
                <SelectValue
                  placeholder={
                    (table
                      .getColumn("organization")
                      ?.getFilterValue() as string) ||
                    "Filtrar por organización"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las organizaciones</SelectItem>
                {orgOptions.map((org) => (
                  <SelectItem key={org} value={org}>
                    {org}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> : null}
          </>
        ) : null}
        <DataTableViewOptions table={table} />
      </div>
      <Table>
        <TableHeader className="bg-primary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    align="center"
                    className="bg-white"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} align="center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </>
  );
}

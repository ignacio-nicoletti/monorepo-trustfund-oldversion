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
import { DataTablePagination } from "../ExtraComponents/Pagination.tsx";
import { useMemo, useState } from "react";
import { DataTableViewOptions } from "../ExtraComponents/ColumnToggle.tsx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableUsers<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const roles = useMemo(() => {
    return Array.from(new Set(data.map((item: any) => item?.role ?? null)));
  }, [data]);

  const users = useMemo(() => {
    return Array.from(new Set(data.map((item: any) => item?.fullName ?? null)));
  }, [data]);

  const orgOptions = useMemo(() => {
    return Array.from(
      new Set(data.map((item: any) => item?.organization ?? null))
    );
  }, [data]);

  return (
    <>
      <div className="grid grid-cols-8 w-full gap-2 items-center p-2 bg-primary/15 rounded-tr-md rounded-tl-md border-t border-r border-l">
        <Select
          onValueChange={(value) =>
            value !== "todos"
              ? table.getColumn("fullName")?.setFilterValue(value)
              : table.getColumn("fullName")?.setFilterValue("")
          }
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
        >
          <SelectTrigger className="w-full h-auto bg-white placeholder:text-secondary-foreground border border-primary">
            <SelectValue
              placeholder={
                (table.getColumn("role")?.getFilterValue() as string) ||
                "Responsable"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los usuarios</SelectItem>
            {users.map((users) => (
              <SelectItem key={users} value={users}>
                {users}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {orgOptions?.length > 1 ? (
          <Select
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
            <SelectTrigger className="w-full h-auto bg-white placeholder:text-secondary-foreground border border-primary">
              <SelectValue
                placeholder={
                  (table.getColumn("role")?.getFilterValue() as string) ||
                  "Organización"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las organizaciones</SelectItem>
              {orgOptions.map((organization) => (
                <SelectItem key={organization} value={organization}>
                  {organization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <Select
          onValueChange={(value) =>
            value !== "todos"
              ? table.getColumn("role")?.setFilterValue(value)
              : table.getColumn("role")?.setFilterValue("")
          }
          value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
        >
          <SelectTrigger className="w-full h-auto bg-white placeholder:text-secondary-foreground border border-primary">
            <SelectValue
              placeholder={
                (table.getColumn("role")?.getFilterValue() as string) || "Rol"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Spacer divs: ajustart en función de la cantidad de columnas declaradas menos los filtros antecedentes */}
        {[...Array(Math.max(0, 8 - (orgOptions?.length > 1 ? 4 : 3)))].map(
          (_, i) => (
            <div key={`spacer-${i}`}></div>
          )
        )}
        <DataTableViewOptions table={table} />
      </div>

      <Table>
        <TableHeader className="bg-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} align="center">
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

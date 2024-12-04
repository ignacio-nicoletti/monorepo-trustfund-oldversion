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
  Table as TableType,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/ui/table.tsx";
import { DataTablePagination } from "../ExtraComponents/Pagination";
import { useMemo, useState } from "react";
import { SummaryRow } from "./columns/quotas/SummaryRow";
import TableFilters from "./Filters";
import { useSession } from "next-auth/react";
import { Quota } from "../../detailWarranty/DataTableWarrantiesDetailCuotas/columns/types";

const monthArray = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { data: session } = useSession();

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

  const currentMonth = monthArray[new Date().getMonth()];

  const statusOptions = useMemo(() => {
    return Array.from(new Set(data.map((item: any) => item?.status ?? null)));
  }, [data]);

  const months = useMemo(() => {
    return Array.from(new Set(data.map((item: any) => item?.month ?? null)));
  }, [data]);

  const years = useMemo(() => {
    return Array.from(new Set(data.map((item: any) => item.year)));
  }, [data]);
  const orgOptions = useMemo(() => {
    return Array.from(new Set(data.map((item: any) => item.organization)));
  }, [data]);

  const areReservationsInMonth = data.find(
    (quota: any) => new Date(quota.expiration).getMonth() === new Date().getMonth()
  );

  const filters = [
    { column: "currency", type: "select", placeholder: "Moneda", options: ["ARS", "USD"], defaultValue: "ARS" },
    { column: "status", placeholder: "Estado", options: statusOptions },
    { column: "year", placeholder: "Año", options: years },
    { column: "organization", placeholder: "Organización", options: orgOptions },
    {
      column: "month",
      placeholder: "Mes",
      options: months,
    },
    {
      column: "sucursal",
      placeholder: "Sucursal",
      options: ["Buenos Aires", "Mendoza"],
      defaultValue: "Buenos Aires",
    },
  ];

  return (
    <>
      <TableFilters table={table} filters={filters} />

      <Table>
        <TableHeader className="bg-primary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} align="center" className="bg-white">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
          {table.getFilteredRowModel().rows.length > 0 && <SummaryRow table={table as unknown as TableType<Quota>} />}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </>
  );
}

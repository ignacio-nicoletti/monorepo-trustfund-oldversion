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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table.tsx";
import { DataTablePagination } from "../ExtraComponents/Pagination";
import { useMemo, useState } from "react";
import NoData from "../../NoData/NoData";
import { SummaryRow } from "./columns/SummaryRow";
import { Warranty } from "./columns/completed-warranties/columns";
import TableFilters from "./Filters";
import capitalize from "~/src/utils/capitalizeWord";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: {
    totalGarantia: number;
    garantias: TData[];
  };
  userDetail?: boolean;
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
    data: data.garantias as TData[],
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

  if (!data?.garantias?.length) {
    return <NoData dataType="garantias" />;
  }

  const agentOptions: string[] = useMemo(() => {
    return Array.from(
      new Set(data.garantias.map((item: any) => item.responsable))
    );
  }, [data]);

  const orgOptions = useMemo(() => {
    return Array.from(
      new Set(data.garantias.map((item: any) => item?.organization ?? null))
    );
  }, [data]);

  const statusOptions: string[] = useMemo(() => {
    return Array.from(
      new Set(data.garantias.map((item: any) => item.statusWarranty))
    );
  }, [data]);

  const isCompleted = useMemo(() => {
    return data.garantias.every(
      (elem: any) => elem.statusWarranty === "Cerrado Ganado"
    );
  }, [table]);

  const months: string[] = useMemo(() => {
    return Array.from(
      new Set(
        data.garantias
          .map((item: any) => item.month)
          .filter((elem) => elem !== null)
      )
    );
  }, [data]);

  const years: number[] = useMemo(() => {
    return Array.from(new Set(data.garantias.map((item: any) => item.year)));
  }, [data]);

  const defaultMonth = capitalize(
    new Date().toLocaleDateString("es-ES", {
      month: "long",
    })
  );

  const areReservationsInMonth = data.garantias.find(
    (warranty: any) =>
      new Date(warranty.reservationDate).getMonth() === new Date().getMonth()
  );

  //! Chequeo que sean garantias con cuotas en proceso y creo los filtros en funcion de eso.
  const filters = isCompleted
    ? [
        { column: "year", type: "select", placeholder: "Año", options: years },
        {
          column: "month",
          type: "select",
          placeholder: "Mes",
          options: months,
          // defaultValue: "todos",
        },
        {
          column: "sucursal",
          type: "select",
          placeholder: "Sucursal",
          options: ["Buenos Aires", "Mendoza"],
          // defaultValue: "todos",
        },
        {
          column: "coverageType",
          type: "select",
          placeholder: "Cobertura",
          options: [
            "Cobertura Básica",
            "Cobertura Intermedia",
            "Cobertura Completa",
          ],
        },
        {
          column: "currency",
          type: "select",
          placeholder: "Moneda",
          options: ["ARS", "USD"],
          defaultValue: "ARS",
        },
        {
          column: "paymentMethod",
          type: "select",
          placeholder: "Financiación",
          options: ["Contado", "3 Cuotas", "6 Cuotas"],
        },
        {
          column: "responsable",
          type: "select",
          placeholder: "Responsable",
          options: agentOptions,
        },
        {
          column: "organization",
          type: "select",
          placeholder: "Organización",
          options: orgOptions,
        },
        { column: "requesterName", type: "text", placeholder: "Cliente..." },
        { column: "inmobiliaria", type: "text", placeholder: "Inmo..." },
      ]
    : [
        { column: "inmobiliaria", type: "text", placeholder: "Inmo..." },
        { column: "cliente", type: "text", placeholder: "Cliente..." },
        {
          column: "responsable",
          type: "select",
          placeholder: "Responsable",
          options: agentOptions,
        },
        {
          column: "organization",
          type: "select",
          placeholder: "Organización",
          options: orgOptions,
        },
        {
          column: "sucursal",
          type: "select",
          placeholder: "Sucursal",
          options: ["Buenos Aires", "Mendoza"],
          defaultValue: "Buenos Aires",
        },
        {
          column: "statusWarranty",
          type: "select",
          placeholder: "Estado",
          options: statusOptions,
        },
        {
          column: "month",
          type: "select",
          placeholder: "Mes",
          options: months,
        },
      ];

  return (
    <>
      <TableFilters table={table} filters={filters} />

      <Table>
        <TableHeader>
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
          {isCompleted && (
            <SummaryRow table={table as unknown as TableType<Warranty>} />
          )}
        </TableBody>
      </Table>

      <DataTablePagination table={table} />
    </>
  );
}

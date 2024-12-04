"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "../../../ExtraComponents/ColumnHeader";

import { Badge } from "@repo/ui/components/ui/badge.tsx";

import ChangeQuotaStatus from "./ChangeQuotaStatus";
import { useSession } from "next-auth/react";
import {
  Quota,
  Status,
} from "~/src/components/detailWarranty/DataTableWarrantiesDetailCuotas/columns/types";

export const useColumns = (): ColumnDef<Quota>[] => {
  const { data: session } = useSession();

  const baseColumns: ColumnDef<Quota>[] = [
    {
      accessorKey: "currency",
      meta: { title: "Moneda" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Moneda" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("currency")}
        </div>
      ),
      footer: "currency",
    },
    {
      accessorKey: "status",
      meta: { title: "Estado" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => {
        const status: Status = row.getValue("status");

        return (
          <Badge
            className={`${
              status === "Pendiente"
                ? "bg-orange-400 hover:bg-orange-500"
                : status === "Pago"
                  ? "bg-green-300 hover:bg-green-400"
                  : "bg-red-300 hover:bg-red-400"
            } w-32 py-2 text-white m-auto justify-center cursor-context-menu`}
          >
            {status}
          </Badge>
        );
      },
      footer: "status",
    },
    {
      accessorKey: "year",
      meta: { title: "Año" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Año" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.getValue("year")}</div>
      ),
      footer: "year",
      filterFn: (row, columnId, filterValue) => {
        const rowValue = row.getValue<number>(columnId);
        return rowValue === Number(filterValue); // Ensure strict equality
      },
    },
    {
      accessorKey: "month",
      meta: { title: "Mes" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mes" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.getValue("month")}</div>
      ),
      footer: "expiration",
    },
    {
      accessorKey: "sucursal",
      meta: { title: "Sucursal" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sucursal" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("sucursal")}
        </div>
      ),
      footer: "sucursal",
    },
    {
      accessorKey: "organization",
      meta: { title: "Organización" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Organización" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("organization")}
        </div>
      ),
      footer: "Organización",
    },
    {
      accessorKey: "amount",
      meta: { title: "Monto" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Monto" />
      ),
      cell: ({ row }) => {
        const value = Number(row.getValue("amount"));
        const currency = row.original.currency;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          notation: "standard",
        }).format(value);

        return <div className="text-center font-medium">{formatted}</div>;
      },
      footer: "amount",
    },
    {
      accessorKey: "interest",
      meta: { title: "Intereses" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Intereses" />
      ),
      cell: ({ row }) => {
        const value = Number(row.getValue("interest"));
        const currency = row.original.currency;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          notation: "standard",
        }).format(value);

        return <div className="text-center font-medium">{formatted}</div>;
      },
      footer: "interest",
    },
    {
      accessorKey: "expiration",
      meta: { title: "Vencimiento" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vencimiento" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("expiration"));
        const formattedDate = date.toLocaleDateString("es-ES", {
          weekday: "long", // Lunes, Martes, etc.
          day: "numeric", // 1, 2, 3...
          month: "long", // Enero, Febrero, etc.
          year: "numeric",
        });
        return <div className="text-center font-medium">{formattedDate}</div>;
      },
      footer: "expiration",
    },
  ];

  // Conditionally add the "actions" column
  if (session?.user.role === 3) {
    baseColumns.push({
      id: "actions",
      meta: { title: "Acciones" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Acciones" />
      ),
      cell: ({ row }) => <ChangeQuotaStatus row={row} />,
    });
  }

  return baseColumns;
};

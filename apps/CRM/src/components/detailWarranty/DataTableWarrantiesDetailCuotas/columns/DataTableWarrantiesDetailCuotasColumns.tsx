"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/src/components/Tables/ExtraComponents/ColumnHeader";
import { formatDate } from "../../../../utils/formatDate";

import { Badge } from "@repo/ui/components/ui/badge.tsx";
import { Quota } from "./types";

export const DataTableWarrantiesDetailCuotasColumns: ColumnDef<Quota>[] = [
  {
    accessorKey: "numberOfQuota",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N° Cuota" />
    ),
    cell: ({ row }) => {
      const value = Number(row.getValue("numberOfQuota"));
      return <div className="text-center font-medium">{value}</div>;
    },
    footer: "numberOfQuota",
  },
  {
    accessorKey: "month",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mes" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("month")}</div>
      );
    },
    footer: "month",
  },

  {
    accessorKey: "expiration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha vencimiento" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {formatDate(row.getValue("expiration"))}
        </div>
      );
    },
    footer: "expiration",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) => {
      const { currency } = row.original;
      const amount = Number(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: currency ?? "ARS",
        notation: "standard",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
    footer: "amount",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status");

      return (
        <Badge
          className={`${
            status === "Pendiente"
              ? "bg-orange-400 hover:bg-orange-500"
              : status === "Pago"
                ? "bg-green-300 hover:bg-green-400"
                : "bg-red-300 hover:bg-red-400"
          } w-32 py-2 m-auto text-black text-sm justify-center cursor-context-menu`}
        >
          {status === "Pendiente"
            ? "Pendiente"
            : status === "Pago"
              ? "Pagada"
              : "Deuda"}
        </Badge>
      );
    },
    footer: "status",
  }
];

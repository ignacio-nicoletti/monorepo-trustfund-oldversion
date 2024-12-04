"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/src/components/Tables/ExtraComponents/ColumnHeader";
import { formatDate } from "../../../../utils/formatDate";

import { Badge } from "@repo/ui/components/ui/badge.tsx";
import ChangeQuotaStatus from "~/src/components/Tables/DataTableQuota/columns/quotas/ChangeQuotaStatus";
import Link from "next/link";
import AddQuotaFile from "../AddQuotaFile";
import { Quota } from "./types";

export const DataTableWarrantiesDetailCuotasAdminColumns: ColumnDef<Quota>[] = [
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
  },
  {
    accessorKey: "receiptPayment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recibo" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center bg-[#1c68ab] border border-primary rounded-lg p-1 cursor-pointer gap-2 w-2/3">
          {row.getValue("receiptPayment") ? (
            <div className="flex gap-4 justify-center items-center">
              <Link
                href={row.getValue("receiptPayment")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white hover:underline"
              >
                Ver Recibo
              </Link>
              <div className="bg-white w-6 rounded hover:cursor-pointer hover:scale-110 transition-all duration-150">
              <AddQuotaFile
                row={row}
                type={"Recibo de Pago"}
                title={"Adjuntar Recibo"}
                editMode={true}
              />
              </div>
            </div>
          ) : (
            <AddQuotaFile
              row={row}
              type={"Recibo de Pago"}
              title={"Adjuntar Recibo"}
            />
          )}
        </div>
      );
    },
    footer: "receiptPayment",
  },
  {
    accessorKey: "proofPayment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comprobante" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center bg-[#1c68ab] border border-primary rounded-lg p-1 cursor-pointer gap-2 w-2/3">
          {row.getValue("proofPayment") ? (
            <div className="flex gap-4">
              <Link
                href={row.getValue("proofPayment")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white hover:underline"
              >
                Ver Comprobante
              </Link>
              <div className="bg-white w-6 rounded hover:cursor-pointer hover:scale-110 transition-all duration-150">
                <AddQuotaFile
                  row={row}
                  type={"Comprobante de pago"}
                  title={"Adjuntar Comprobante"}
                  editMode={true}
                />
              </div>
            </div>
          ) : (
            <AddQuotaFile
              row={row}
              type={"Comprobante de pago"}
              title={"Adjuntar Comprobante"}
            />
          )}
        </div>
      );
    },
    footer: "proofPayment",
  },
  {
    accessorKey: "Acciones",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    cell: ({ row }) => <ChangeQuotaStatus row={row} detail={false} />,
  },
];

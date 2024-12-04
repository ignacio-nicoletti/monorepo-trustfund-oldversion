"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@repo/ui/components/ui/checkbox.tsx";

import { DataTableColumnHeader } from "../../../ExtraComponents/ColumnHeader";
import Link from "next/link";

import { useSession } from "next-auth/react";

import { Ban, ScanSearch } from "lucide-react";

export type Warranty = {
  id: string | null;
  responsableId: string | null;
  reservationDate: Date | null;
  contractDuration: string | null;
  warrantyType: "Vivienda" | "Comercio";
  requesterName: string | null;
  responsable: string;
  sucursal: string | null;
  inmobiliaria: string | null;
  coverageType: "Básica" | "Intermedia" | "Completa";
  warrantyAmount: number | null;
  reservationAmount: number | null;
  paymentMethod: "Contado" | "3 cuotas" | "6 cuotas";
  currencyType: string;
};

export const columns: ColumnDef<Warranty>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="bg-primary-foreground"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "reservationDate",
    meta: {
      title: "Fecha reserva",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha reserva" />,
    cell: ({ row }) => {
      const date: Date = new Date(row.getValue("reservationDate"));

      // Formatear la fecha para que devuelva día de la semana y mes
      const formattedDate = date.toLocaleDateString("es-ES", {
        day: "numeric", // 1, 2, 3...
        month: "short", // Enero, Febrero, etc.
        year: "numeric",
      });

      return (
        <div className="text-center font-medium">
          {row.getValue("reservationDate") ? formattedDate : "-"}
        </div>
      );
    },
    footer: "Fecha reserva",
  },
  {
    accessorKey: "contractDuration",
    meta: {
      title: "Contrato",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contrato" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("contractDuration")}</div>
    ),
    footer: "Tiempo de contrato",
  },
  {
    accessorKey: "warrantyType",
    meta: {
      title: "Tipo de garantía",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo de garantía" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("warrantyType") ?? "-"}</div>
    ),
    footer: "Tipo de garantía",
  },
  {
    accessorKey: "requesterName",
    meta: {
      title: "Cliente",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("requesterName")}</div>
    ),
    footer: "Cliente",
  },
  {
    accessorKey: "responsable",
    meta: {
      title: "Responsable",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Responsable" />,
    cell: ({ row }) => <div className="text-center font-medium">{row.getValue("responsable")}</div>,
    footer: "Responsable",
  },
  {
    accessorKey: "provincia",
    meta: {
      title: "Provincia",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Provincia" />,
    cell: ({ row }) => <div className="text-center font-medium">{row.getValue("provincia")}</div>,
    footer: "Provincia",
  },
  {
    accessorKey: "inmobiliaria",
    meta: {
      title: "Inmobiliaria",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Inmobiliaria" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("inmobiliaria")}</div>
    ),
    footer: "Inmobiliaria",
  },
  {
    accessorKey: "coverageType",
    meta: {
      title: "Cobertura",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="% Cobertura" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("coverageType")}</div>
    ),
    footer: "Tipo de cobertura",
  },
  {
    accessorKey: "warrantyAmount",
    meta: {
      title: "Total garantía",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total garantía" />,
    cell: ({ row }) => {
      const value = row.getValue("warrantyAmount");
      const currencyType = row.original.currencyType || "USD"; // Valor por defecto si currencyType es nulo o vacío

      // Validación adicional para el valor de currencyType
      const validCurrency = ["USD", "ARS", "EUR"].includes(currencyType) ? currencyType : "USD";

      if (value !== null && value !== undefined) {
        const isRound = Number(value) % 100 === 0;

        const formattedValue = isRound
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: validCurrency,
              notation: "compact",
            }).format(Number(value))
          : new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: validCurrency,
              notation: "standard",
            }).format(Number(value));

        const displayValue = validCurrency === "USD" ? `USD ${formattedValue}` : formattedValue;

        return <div className="text-center font-medium">{displayValue}</div>;
      }

      return <div className="text-center font-medium">-</div>;
    },
    footer: "Total garantía",
  },
  {
    accessorKey: "reservationAmount",
    meta: {
      title: "Valor reserva",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valor reserva" />,
    cell: ({ row }) => {
      const value = row.getValue("reservationAmount");
      const currencyType = row.original.currencyType || "USD"; // Valor por defecto si es nulo o vacío

      // Validación adicional para el valor de currencyType
      const validCurrency = ["USD", "ARS", "EUR"].includes(currencyType) ? currencyType : "USD";

      if (value !== null && value !== undefined && !isNaN(Number(value))) {
        const isRound = Number(value) % 100 === 0;

        const formattedValue = isRound
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: validCurrency,
              notation: "compact",
            }).format(Number(value))
          : new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: validCurrency,
              notation: "standard",
            }).format(Number(value));

        const displayValue = validCurrency === "USD" ? `USD ${formattedValue}` : formattedValue;

        return <div className="text-center font-medium">{displayValue}</div>;
      }

      // Mostrar "-" si el valor es nulo o inválido
      return <div className="text-center font-medium">-</div>;
    },
    footer: "Valor reserva",
  },

  {
    accessorKey: "paymentMethod",
    meta: {
      title: "Financiacíon",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Financiación" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("paymentMethod") ?? "-"}</div>
    ),
    footer: "Método de pago",
  },
  {
    accessorKey: "statusWarranty",
    meta: {
      title: "Estado",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("statusWarranty") ?? "-"}</div>
    ),
    footer: "Estado",
  },
  {
    id: "actions",
    meta: {
      title: "Detalle",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Detalle" className="text-black" />
    ),
    cell: ({ row }) => {
      const garantia = row.original;
      const { data: session } = useSession();

      if (session?.user.id === garantia.responsableId || session?.user.role === 3) {
        return (
          <Link
            href={`/dashboard/garantias/${garantia.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex rounded-md justify-center py-1"
          >
            <ScanSearch size={20} />
          </Link>
        );
      }else {
        return <Ban size={15} />;
      }
    },
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../ExtraComponents/ColumnHeader";

export type ExpiredWarranty = {
  id: string;
  responsableId: string | null;
  reservationDate: Date | null;
  contractDuration: string | null;
  warrantyType: "Vivienda" | "Comercio" | string | null;
  // requesterName?: string;
  responsable: "Evelyn" | "Victoria" | "Sol" | "Melisa" | "Yamila" | string;
  sucursal: "Buenos Aires" | "Mendoza" | string | null;
  inmobiliaria: string | null;
  coverageType: "Básica" | "Intermedia" | "Completa" | string;
  warrantyAmount: number | null;
  currency: string | null;
  reservationAmount: number | null;
  paymentMethod: "Contado" | "3 cuotas" | "6 cuotas" | string | null;
  statusWarranty: string | null;
  organization: string | null;
  month: string | null;
  year: number | null;
};

export const columns: ColumnDef<ExpiredWarranty>[] = [
  {
    accessorKey: "year",
    meta: {
      title: "Año",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Año" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("year") ?? "-"}
      </div>
    ),
    footer: "Año",
    filterFn: (row, columnId, filterValue) => {
      const rowValue = row.getValue<number>(columnId);
      return rowValue === Number(filterValue); // Ensure strict equality
    },
  },
  {
    accessorKey: "month",
    meta: {
      title: "Mes",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mes" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("month") ?? "-"}
      </div>
    ),
    footer: "Mes",
  },
  {
    accessorKey: "sucursal",
    meta: {
      title: "Sucursal",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sucursal" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("sucursal") ?? "-"}
      </div>
    ),
    footer: "sucursal",
  },
  {
    accessorKey: "coverageType",
    meta: {
      title: "Cobertura",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="% Cobertura" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("coverageType") ?? "-"}
      </div>
    ),
    footer: "Tipo de cobertura",
  },
  {
    accessorKey: "currency",
    meta: {
      title: "Moneda",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Moneda" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("currency") ?? "-"}
      </div>
    ),
    footer: "Moneda",
  },
  {
    accessorKey: "paymentMethod",
    meta: {
      title: "Financiacíon",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Financiacíon" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("paymentMethod") ?? "-"}
      </div>
    ),
    footer: "Método de pago",
  },
  {
    accessorKey: "responsable",
    meta: {
      title: "Responsable",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Responsable" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("responsable") ?? "-"}
      </div>
    ),
    footer: "Responsable",
  },
  {
    accessorKey: "organization",
    meta: {
      title: "Organización",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Organización" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("organization") ?? "-"}
      </div>
    ),
    footer: "Organización",
  },
  {
    accessorKey: "inmobiliaria",
    meta: {
      title: "Inmobiliaria",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inmobiliaria" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("inmobiliaria") ?? "-"}
      </div>
    ),
    footer: "Inmobiliaria",
  },
  {
    accessorKey: "warrantyType",
    meta: {
      title: "Tipo de garantía",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de garantía" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("warrantyType") ?? "-"}
      </div>
    ),
    footer: "Tipo de garantía",
  },
  {
    accessorKey: "warrantyAmount",
    meta: {
      title: "Total garantía",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total garantía" />
    ),
    cell: ({ row }) => {
      const value = Number(row.getValue("warrantyAmount"));
      const currency = row.original.currency;

      const formattedValue = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: currency == "ARS" ? "ARS" : "USD",
        notation: "standard",
      }).format(value);

      return <div className="text-center font-medium">{formattedValue}</div>;
    },
    footer: "Total garantía",
  },
  {
    accessorKey: "reservationAmount",
    meta: {
      title: "Valor reserva",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor reserva" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("reservationAmount") as number;
      const currency = row.original.currency;

      if (value !== null && value !== undefined) {
        const formattedValue = new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: currency === "ARS" ? "ARS" : "USD",
          notation: "standard",
        }).format(Number(value)); // Convertimos a número después de validar

        return <div className="text-center font-medium">{formattedValue}</div>;
      }

      // Manejo explícito de valores nulos o indefinidos
      return <div className="text-center font-medium">{"-"}</div>;
    },
    footer: "Valor reserva",
  },
  // {
  //   id: "actions",
  //   meta: {
  //     title: "Acción",
  //   },
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Acción"
  //       className="text-black"
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     const garantia = row.original;
  //     const { data: session } = useSession();

  //     if (
  //       session?.user.id === garantia.responsableId ||
  //       session?.user.role === 3
  //     ) {
  //       return (
  //         <Link
  //           href={`/dashboard/garantias/${garantia.id}`}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="flex rounded-md justify-center py-1"
  //         >
  //           <ScanSearch size={20} />
  //         </Link>
  //       );
  //     } else {
  //       return <Ban size={15} />;
  //     }
  //   },
  // },
];

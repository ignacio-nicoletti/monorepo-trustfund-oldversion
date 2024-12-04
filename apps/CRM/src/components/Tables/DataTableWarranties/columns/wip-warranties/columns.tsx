"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../ExtraComponents/ColumnHeader";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Ban, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu.tsx";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog.tsx";
import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { useRouter } from "next/navigation";

export type WipWarranty = {
  id: string;
  cliente: string | undefined;
  inmobiliaria: string | undefined;
  tipo: "Vivienda" | "Comercio" | undefined;
  responsable: "Evelyn" | "Victoria" | "Sol" | "Melisa" | "Yamila";
  responsableId: string | undefined;
  sucursal: "Buenos Aires" | "Mendoza";
  metodoPago: "Contado" | "3 cuotas" | "6 cuotas" | undefined;
  statusWarranty: string;
  organization: string | null;
  month: string;
  date: Date;
};

export const columns: ColumnDef<WipWarranty>[] = [
  {
    accessorKey: "inmobiliaria",
    meta: {
      title: "Inmobiliaria",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre inmo" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("inmobiliaria") ?? "-"}
      </div>
    ),
    footer: "inmobiliaria",
  },
  {
    accessorKey: "cliente",
    meta: {
      title: "Cliente",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("cliente") ?? "-"}
      </div>
    ),
    footer: "cliente",
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
        {row.getValue("responsable")}
      </div>
    ),
    footer: "responsable",
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
        {row.getValue("organization")}
      </div>
    ),
    footer: "Organización",
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
    accessorKey: "statusWarranty",
    meta: {
      title: "Estado",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("statusWarranty") ?? "-"}
      </div>
    ),
    footer: "Estado",
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
    accessorKey: "tipo",
    meta: {
      title: "Tipo de garantía",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de garantia" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("tipo") ?? "-"}
      </div>
    ),
    footer: "tipo",
  },
  {
    accessorKey: "metodoPago",
    meta: {
      title: "Financiación",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Financiación" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("metodoPago") ?? "-"}
      </div>
    ),
    footer: "metodoPago",
  },
  {
    accessorKey: "fechaInicioCarga",
    meta: {
      title: "Fecha de carga",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de carga" />
    ),
    cell: ({ row }) => {
      const date: Date = new Date(row.getValue("fechaInicioCarga"));

      // Formatear la fecha para que devuelva día de la semana y mes
      const formattedDate = date.toLocaleDateString("es-ES", {
        day: "numeric", // 1, 2, 3...
        month: "long", // Enero, Febrero, etc.
        year: "numeric",
      });

      return (
        <div className="text-center font-medium">
          {row.getValue("fechaInicioCarga") ? formattedDate : "-"}
        </div>
      );
    },
    footer: "Fecha de carga",
  },
  {
    id: "actions",
    meta: {
      title: "Acción",
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Acción"
        className="text-black"
      />
    ),
    cell: ({ row }) => {
      const garantia = row.original;
      const { data: session } = useSession();
      const [isOpen, setIsOpen] = useState(false);
      const { toast } = useToast();
      const router = useRouter();
      const handleDeleteWarranty = async () => {
        try {
          const response = await fetch(`/api/warranties/${garantia.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            toast({
              variant: "destructive",
              title: "Error al eliminar la garantía",
              description: "algo salio mal",
            });
            // throw new Error("Error al eliminar la garantía");
          }
          toast({
            variant: "success",
            title: "Garantía borrada correctamente.",
          });
          router.refresh();
        } catch (error) {
          console.error("Error eliminando la garantía:", error);
          // Aquí puedes manejar el error, como mostrar una notificación al usuario
        }
      };
      //El unico caso donde se puede eliminar la garantia
      if (
        garantia.statusWarranty === "Cerrado Perdido" &&
        session?.user?.role === 3
      ) {
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 self-center">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer">
                  <Link
                    href={`/dashboard/garantias/${garantia.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex rounded-md justify-center py-1"
                  >
                    Ver detalle
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="hidden" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>¿Desea eliminar esta garantía?</DialogTitle>
                  <DialogDescription>
                    <p className="text-sm text-slate-500">
                      Al presionar "Aceptar", la garantía será eliminada
                      permanentemente.
                    </p>
                    <p className="text-sm text-slate-500">
                      Esta acción no se puede deshacer.
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={() => handleDeleteWarranty()}>
                    Aceptar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );
      } else if (
        (garantia.statusWarranty !== "Cerrado Perdido" &&
          session?.user?.id === garantia?.responsableId) ||
        (garantia.statusWarranty !== "Cerrado Perdido" &&
          session?.user?.role === 3)
      ) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 self-center">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              {garantia.statusWarranty === "Cerrado Ganado" ? (
                <DropdownMenuItem className="cursor-pointer">
                  <Link
                    href={`/dashboard/garantias/${garantia.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex rounded-md justify-center py-1"
                  >
                    Ver detalle
                  </Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  href={`/dashboard/cargar-garantia/${garantia.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex rounded-md justify-center py-1"
                >
                  Editar
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                Eliminar
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      } else {
        return <Ban size={15} />;
      }
    },
  },
];

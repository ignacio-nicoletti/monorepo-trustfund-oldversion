"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Ban, MoreHorizontal } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu.tsx";

import { DataTableColumnHeader } from "../../../ExtraComponents/ColumnHeader";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog.tsx";

// TODO: CREAR ENDPOINT INMOBILIARIA/ID PARA IMPLEMENTAR EL METODO DELETE

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RealState = {
  id: string;
  name: string | null;
  manager: string | null;
  agent: string | null;
  agentEmail: string | null;
  agentId: string | null;
  city: string | null;
  date: string | null;
  count?: number;
  comment?: string;
  garantiasGanadas: number | null;
  garantiasPerdidas: number | null;
  garantiasEnProceso: number | null;
  organization: string | null;
};

export const columns: ColumnDef<RealState>[] = [
  {
    accessorKey: "name",
    meta: {
      title: "Nombre inmo",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre inmo" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("name")}</div>
    ),
    footer: "Name",
  },
  {
    accessorKey: "manager",
    meta: {
      title: "Asesor",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asesor" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("manager")}</div>
    ),
    footer: "manager",
  },
  {
    accessorKey: "city",
    meta: {
      title: "Localidad",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Localidad" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("city")}</div>
    ),
    footer: "city",
  },
  {
    accessorKey: "agent",
    meta: {
      title: "Responsable",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Responsable" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("agent")}</div>
    ),
    footer: "agent",
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
    footer: "organization",
  },
  {
    accessorKey: "garantiasGanadas",
    meta: {
      title: "Garantías ganadas",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Garantías ganadas" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("garantiasGanadas") ?? "-"}
      </div>
    ),
    footer: "Ganadas",
  },
  {
    accessorKey: "garantiasPerdidas",
    meta: {
      title: "Garantías perdidas",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Garantías perdidas" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("garantiasPerdidas") ?? "-"}
      </div>
    ),
    footer: "Perdidas",
  },
  {
    accessorKey: "garantiasEnProceso",
    meta: {
      title: "Garantías en proceso",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Garantías en proceso" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("garantiasEnProceso") ?? "-"}
      </div>
    ),
    footer: "En proceso",
  },

  {
    accessorKey: "comment",
    meta: {
      title: "Comentario",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comentario" />
    ),
    cell: ({ row }) => {
      <div className="text-center font-medium w-fit">
        {row.getValue("comment") ?? "-"}
      </div>;
    },

    footer: "comment",
  },
  {
    accessorKey: "date",
    meta: {
      title: "Fecha de carga",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de carga" />
    ),
    cell: ({ row }) => {
      const date: Date = new Date(row.getValue("date"));

      // Formatear la fecha para que devuelva día de la semana y mes
      const formattedDate = date.toLocaleDateString("es-ES", {
        weekday: "long", // Lunes, Martes, etc.
        day: "numeric", // 1, 2, 3...
        month: "long", // Enero, Febrero, etc.
        year: "numeric",
      });

      return <div className="text-center font-medium">{formattedDate}</div>;
    },
    footer: "Fecha de carga",
  },
  {
    id: "actions",
    meta: {
      title: "Acciones",
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Acciones"
        className="bg-white text-black"
      />
    ),
    cell: ({ row }) => {
      const realState = row.original;
      const { data: session } = useSession();
      const { toast } = useToast();
      const [isOpen, setIsOpen] = useState(false);
      const deleteIncome = async (id: string) => {
        let res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/inmobiliarias/${id.toString()}`,
          {
            method: "DELETE",
          }
        );

        if (res.status === 200) {
          toast({
            variant: "success",
            title: "Inmobiliaria eliminada correctamente",
          });

          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          toast({
            title: "Fallo al eliminar la inmobiliaria",
            variant: "destructive",
          });
        }
      };

      if (session?.user.id === realState.id || session?.user.role === 3) {
        return (
          <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="hidden" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>¿Desea eliminar esta inmobiliaria?</DialogTitle>
                  <DialogDescription>
                    <p className="text-sm text-slate-500">
                      Al presionar "Aceptar", la inmobiliaria será eliminada
                      permanentemente.
                    </p>
                    <p className="text-sm font-bold text-slate-600">
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
                  <Button onClick={() => deleteIncome(realState.id)}>
                    Aceptar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 self-center">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Link
                    href={`/dashboard/registrar-inmobiliaria?editMode=true&id=${realState.id}`}
                    target="_blank"
                  >
                    Editar
                  </Link>{" "}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      } else {
        return <Ban size={15} />;
      }
    },
    footer: "Fecha de carga",
  },
];

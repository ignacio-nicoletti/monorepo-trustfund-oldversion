"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

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
import ButtonChangeStatusUser from "../../ButtonChangeStatusUser";
import { useState } from "react";
import TransferUsersData from "~/src/components/Tables/transferUsersData/transferUsersData";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type user = {
  id: string | null;
  name: string | null;
  lastname: string | null;
  fullName: string | null;
  email: string | null;
  warrantiesWon: number | null;
  warrantiesLost: number | null;
  warrantiesInProcess: number | null;
  status: string | null;
  organization: string | null;
  role: string | null;
};

export const columnsUser: ColumnDef<user>[] = [
  {
    accessorKey: "fullName",
    meta: {
      title: "Nombre"
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("fullName") ?? "-"}</div>
    ),
    footer: "Name",
  },
  {
    accessorKey: "organization",
    meta: {
      title: "Organización"
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Organizacion" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("organization") ?? "-"}</div>
    ),
    footer: "organization",
  },
  {
    accessorKey: "role",
    meta: {
      title: "Rol"
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rol" />,
    cell: ({ row }) => <div className="text-center font-medium">{row.getValue("role") ?? "-"}</div>,
    footer: "role",
  },
  {
    accessorKey: "email",
    meta: {
      title: "Email"
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("email") ?? "-"}</div>
    ),
    footer: "email",
  },
  {
    accessorKey: "warrantiesWon",
    meta: {
      title: "Garantías ganadas"
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Garantías ganadas" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("warrantiesWon") ?? "No registrada"}
      </div>
    ),
    footer: "warrantiesWon",
  },
  {
    accessorKey: "warrantiesLost",
    meta: {
      title: "Garantías perdidas"
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Garantías perdidas" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("warrantiesLost") ?? "No registrada"}
      </div>
    ),
    footer: "warrantiesLost",
  },
  {
    accessorKey: "warrantiesInProcess",
    meta: {
      title: "Garantías en proceso"
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Garantías en proceso" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("warrantiesInProcess") ?? "No registra"}
      </div>
    ),
    footer: "warrantiesInProcess",
  },
  {
    accessorKey: "status",
    meta: {
      title: "Estado"
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("status") === "Active"
          ? "Activo"
          : row.getValue("status") === "Deleted"
            ? "Inactivo"
            : "-"}
      </div>
    ),
    footer: "status",
  },

  {
    id: "actions",
    meta: {
      title: "Acciones"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" className="bg-white text-black" />
    ),
    cell: ({ row }) => {
      const user = row.original;

      const [modalOpen, setModalOpen] = useState(false);

      const [modalTransferOpen, setModalTransferOpen] = useState(false);

      const [selectedUser, setSelectedUser] = useState<any>({});

      const handleModalDeleteUser = async (id: string) => {
        setModalOpen(true);
      };

      const openModalTransfer = () => {
        setSelectedUser({
          id: user.id!,
          name: user.name!,
          lastname: user.lastname!,
          warrantiesInProcess: user.warrantiesInProcess!,
        });
        setModalTransferOpen(true);
      };

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
              {user.warrantiesInProcess && user.warrantiesInProcess >= 1 ? (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    openModalTransfer();
                  }}
                >
                  Tranferir gestiones
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.name!.toString())}
              >
                <Link href={`/dashboard/perfil-usuario/${user.id!.toString()}`} target="_blank">
                  Ver detalle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.name!.toString())}
              >
                <Link href={`/dashboard/gestion-usuarios/${user.id!.toString()}`} target="_blank">
                  Editar
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  handleModalDeleteUser(user.id!);
                }}
              >
                {user.status === "Active" ? "Eliminar" : "Activar"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TransferUsersData
            selectedUser={selectedUser}
            modalTransferOpen={modalTransferOpen}
            setModalTransferOpen={setModalTransferOpen}
          />
          <ButtonChangeStatusUser open={modalOpen} setModalOpen={setModalOpen} id={user.id} />
        </>
      );
    },
  },
];

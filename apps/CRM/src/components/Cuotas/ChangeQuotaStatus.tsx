"use client";

import { useState } from "react";

import { Button } from "@repo/ui/components/ui/button.tsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu.tsx";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/ui/dialog.tsx";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select.tsx";

import { cn } from "@repo/ui/lib/utils";

import { MoreHorizontal } from "lucide-react";

import Link from "next/link";
import { markAsPaid } from "~/src/server-actions/quotas";
import { useRouter } from "next/navigation";
import { Quota, Status } from "../detailWarranty/DataTableWarrantiesDetailCuotas/columns/types";

export default function ChangeQuotaStatus({ quota }: { quota: Quota }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("Pendiente");
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = (value: Status) => {
    setStatus(value);
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);

    try {
      const res = await markAsPaid(quota.id, status);
      if(res?.status !== 200) {
        throw Error(res?.message)
      }
    } catch (error: any) {
      throw Error(error.message);
    } finally {
      setIsUpdating(false);
      setOpen(false);
      router.refresh();
    }
  };

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
        <DropdownMenuItem>
          <Button asChild variant={"outline"}>
            <Link href={`/dashboard/garantias/${quota.warrantyId}`} target="_blank">
              Ver detalle
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Cambiar estado</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cambiar estado de la cuota</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-5 items-center justify-start gap-4">
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full m-auto",
                      status === "Pago" && "bg-green-500",
                      status === "Pendiente" && "bg-yellow-500",
                      status === "Deuda" && "bg-red-500"
                    )}
                  />
                  <label htmlFor="status" className="text-start text-sm font-medium">
                    Estado
                  </label>
                  <Select onValueChange={handleStatusChange} value={status} defaultValue={"Pendiente"}>
                    <SelectTrigger className="col-span-3 bg-primary/30">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pago">Pago</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Deuda">Deuda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleUpdateStatus} disabled={isUpdating}>
                {isUpdating ? "Actualizando..." : "Actualizar"}
              </Button>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

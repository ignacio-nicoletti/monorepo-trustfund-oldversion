import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/ui/dialog.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select.tsx";
import { cn } from "@repo/ui/lib/utils";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { markAsPaid } from "~/src/server-actions/quotas";
import type { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { DatePicker } from "~/src/components/forms/inputs/DatePicker";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { Quota, Status } from "~/src/components/detailWarranty/DataTableWarrantiesDetailCuotas/columns/types";

export default function ChangeQuotaStatus({ row, detail = true }: { row: Row<Quota>; detail?: boolean }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>(
    row.original.status === "Pago" ? "Pago" : row.original.status === "Pendiente" ? "Pendiente" : "Deuda"
  );
  const [expiration, setExpiration] = useState(new Date(row.original.expiration).toISOString());
  const [amount, setAmount] = useState(row.original.amount);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const quota = row.original;
  const { toast } = useToast();

  const handleUpdateQuota = async () => {
    setIsUpdating(true);

    try {
      const result = await markAsPaid(quota.id, status, { expiration, amount });
      if (result?.status !== 200) {
        toast({
          variant: "destructive",
          title: "Ocurrio un error al actualizar la cuota.",
        });
        throw new Error(result?.message || "Error al actualizar la cuota");
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      throw new Error(error.message);
    } finally {
      toast({
        variant: "success",
        title: "La cuota se actualizo correctamente.",
      });
      setIsUpdating(false);
      setOpen(false);
      setTimeout(() => {
        router.refresh();
      }, 500);
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
        {detail ? (
          <DropdownMenuItem>
            <Button variant={"ghost"} asChild>
              <Link href={`/dashboard/garantias/${quota.warrantyId}`} target="_blank">
                Ver detalle
              </Link>
            </Button>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Actualizar la cuota</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Actualizar la cuota</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Estado */}
                <div className="flex justify-between items-center gap-4 ">
                  <div className="flex gap-2 ">
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full m-auto ",
                        status === "Pago" && "bg-green-500",
                        status === "Pendiente" && "bg-yellow-500",
                        status === "Deuda" && "bg-red-500"
                      )}
                    />
                    <label htmlFor="status" className="text-start text-sm font-medium">
                      Estado
                    </label>
                  </div>

                  <Select onValueChange={(value) => setStatus(value as Status)} value={status}>
                    <SelectTrigger className="col-span-3 bg-primary/30 w-2/3">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pago">Pago</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Deuda">Deuda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Fecha */}
                <div className="flex justify-between gap-2 items-center ">
                  <label htmlFor="expiration" className="text-start text-sm font-medium">
                    Fecha de vencimiento
                  </label>
                  <div className="w-2/3">
                    <DatePicker
                      setDateValue={setExpiration}
                      placeHolder="Fecha de cobro"
                      name={`date-${quota.numberOfQuota}`}
                      id={`date-${quota.numberOfQuota}`}
                    />
                  </div>
                </div>
                {/* Monto */}
                <div className="flex justify-between gap-4 items-center ">
                  <label htmlFor="amount" className="text-start text-sm font-medium ">
                    Monto
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="col-span-2 border rounded p-2 w-2/3"
                  />
                </div>
              </div>
              <Button onClick={handleUpdateQuota} disabled={isUpdating}>
                {isUpdating ? "Actualizando..." : "Actualizar"}
              </Button>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

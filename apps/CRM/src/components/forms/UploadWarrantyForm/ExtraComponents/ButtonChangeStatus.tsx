"use client";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { useSession } from "next-auth/react";
import JSConfetti from "js-confetti";

type WarrantyStatus = {
  id: number;
  type: string | null;
};

type StatusUpdaterProps = {
  id: string;
  currentStatus: string;
  statuses: WarrantyStatus[];
  realStateId?: string | null;
  setLoading: Dispatch<SetStateAction<boolean>>;
  handleCancelUpdate: any;
};

export default function ButtonChangeStatus({
  id,
  currentStatus,
  statuses,
  realStateId,
  setLoading,
  handleCancelUpdate,
}: StatusUpdaterProps) {
  
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const jsConfetti = new JSConfetti();
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setIsDialogOpen(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      setLoading(true);

      if (selectedStatus === "8") {
        handleCancelUpdate();
      }

      const res = await fetch(`/api/warranties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusId: Number(selectedStatus),
          userId: session?.user.id,
          realStateId: realStateId,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        if (data.confettiNice) {
          const jsConfetti = new JSConfetti();
          jsConfetti.addConfetti({
            emojis: ["✨", "✅", "💲", "🎊", "🤩", "🤑"], // Emojis personalizados
            confettiRadius: 6, // Radio del confeti
            confettiNumber: 250, // Número de partículas
            emojiSize: 50,
          });
        }

        if (data.confettiBad) {
          const jsConfetti = new JSConfetti();
          jsConfetti.addConfetti({
            emojis: ["😒", "👀", "💢", "😪", "❌", "🚩"], // Emojis personalizados
            confettiRadius: 6, // Radio del confeti
            confettiNumber: 250, // Número de partículas
            emojiSize: 50,
          });
        }

        toast({
          title: "Estado modificado correctamente ✅",
          variant: "success",
        });

        setTimeout(() => {
          window.location.reload(); // Solo recarga la página si es necesario
        }, 2000);
      } else {
        toast({
          title: "Error al modificar el estado",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error al modificar el estado",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex items-start space-x-2">
      <Select onValueChange={handleStatusChange} value={selectedStatus}>
        <SelectTrigger className="w-full md:w-[180px] bg-primary text-primary-foreground">
          <SelectValue placeholder="Elije el estado" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status.id} value={status.id.toString()}>
              {status.type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>¿Seguro que deseas actualizar el estado del formulario?</DialogTitle>
            <DialogDescription className="text-black">
              Se actualizará el estado del formulario al aceptar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleConfirmUpdate}
              className="bg-primary duration-100 hover:bg-primary/80"
            >
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

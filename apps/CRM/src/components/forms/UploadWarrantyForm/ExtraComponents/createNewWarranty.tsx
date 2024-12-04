"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog.tsx";
import Spinner from "~/src/components/LoadingUI/Spinner";

export default function CreateNewWarranty() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateWarranty = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/warranties", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id!,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/cargar-garantia/${data.id}`);
        setIsOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error al registrar la garantía",
          description: (await res.text()) || "Algo salió mal",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado",
      });
    }
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  return (
    <section className="flex w-full">
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full xl:w-2/6 bg-primary hover:bg-primary/90 text-white h-14 text-lg font-normal">
              <Plus className="mr-2 h-5 w-5" />
              Iniciar carga
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear nueva garantía</DialogTitle>
              <DialogDescription>
                <p className="text-sm text-slate-500">
                  Al presionar el botón serás redirigido al formulario de carga.
                </p>
                <p className="text-sm text-slate-500">
                  Podrás acceder a él nuevamente desde la sección "Garantías /
                  En proceso" 👍
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateWarranty}>Aceptar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

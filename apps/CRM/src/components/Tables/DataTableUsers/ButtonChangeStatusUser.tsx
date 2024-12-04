import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { useRouter } from "next/navigation";

export default function ButtonChangeStatusUser({ open, setModalOpen, id }: any) {
  const router = useRouter();
  const deleteIncomeUser = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh();
    }
    setModalOpen(!open);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>¿Seguro que deseas actualizar el estado del usuario?</DialogTitle>
          <DialogDescription className="text-black">
            Se actualizara el estado del usuario al aceptar.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="destructive" type="submit" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={() => deleteIncomeUser()}>
            Actualizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

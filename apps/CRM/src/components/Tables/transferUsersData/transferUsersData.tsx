"use client";

import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@repo/ui/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select.tsx";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getAllUsers } from "~/src/server-actions/users";

interface User {
  id: string;
  name: string | null;
  lastname: string | null;
  warrantiesInProcess?: number | null;
}

interface Props {
  selectedUser: User;
  modalTransferOpen: boolean;
  setModalTransferOpen: Dispatch<SetStateAction<boolean>>;
}

export default function TransferUsersData({ selectedUser, modalTransferOpen, setModalTransferOpen }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedToUser, setSelectedToUser] = useState<string>("");
  const [usersActives, setUsersActives] = useState<User[] | undefined>();

  useEffect(() => {
    if (selectedUser.id) {
      getAllUsers()
        .then((usersData) => {
          const activeUsers = usersData
            .filter((user) => user.status === "Active")
            .filter((user) => user.id !== selectedUser.id)
            .map((user) => ({
              id: user.id,
              name: user.name,
              lastname: user.lastname,
            }));
          if (activeUsers?.length > 0) {
            setUsersActives(activeUsers);
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [selectedUser.id]);

  const handleTransfer = () => {
    if (!selectedToUser) {
      console.error("Debe seleccionar un usuario de destino.");
      return;
    }
    //Llamado al endpoint de transferencia con los IDs
    fetch("/api/users/transferData", {
      method: "PUT",
      body: JSON.stringify({
        id1: selectedUser.id,
        id2: selectedToUser,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          toast({
            title: "Lo sentimos algo salio mal",
            variant: "destructive",
          });
          throw new Error("Solicitud: Error en la transferencia de datos");
        }
        return response.json();
      })
      .then(() => {
        setModalTransferOpen(false);
        setSelectedToUser("");
        toast({
          title: "Se transfirio las garantías exitosamente",
          variant: "success",
        });
        router.refresh();
      })
      .catch((error) => {
        toast({
          title: "Lo sentimos algo salio mal",
          variant: "destructive",
        });
        console.error("Error durante la transferencia:", error);
      });
  };

  const handleCancel = () => {
    setModalTransferOpen(false);
    setSelectedToUser("");
  };

  return (
    <Dialog open={modalTransferOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transferir {selectedUser.warrantiesInProcess} garantías</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">De:</Label>
            <span className="col-span-3 border-2 border-primary rounded-lg p-3">
              {selectedUser.name} {selectedUser.lastname}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Para:</Label>
            <Select onValueChange={setSelectedToUser} value={selectedToUser}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar usuario destino" />
              </SelectTrigger>
              <SelectContent>
                {usersActives?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} {user.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => handleCancel()}>
            Cancelar
          </Button>
          <Button onClick={() => handleTransfer()}>Transferir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

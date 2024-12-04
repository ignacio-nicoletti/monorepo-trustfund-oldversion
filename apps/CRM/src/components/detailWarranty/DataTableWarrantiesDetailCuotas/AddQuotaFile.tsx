"use client";

import { useRef, useState } from "react";
import { Button } from "@repo/ui/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog.tsx";
import type { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";
import { Label } from "@repo/ui/components/ui/label.tsx";
import { LucidePaperclip, Pencil } from "lucide-react";
import { Loading } from "@repo/ui/components/Loading/Loading.tsx";
import { z } from "zod";
import { Input } from "@repo/ui/components/ui/input.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Quota } from "./columns/types";

export default function AddQuotaFile({
  row,
  type,
  title,
  editMode = false,
}: {
  row: Row<Quota>;
  type: string;
  title: string;
  editMode?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const quota = row.original;
  const url = type.includes("Recibo")
    ? quota.receiptPayment
    : quota.proofPayment;
  const [urlUploaded, setUrlUploaded] = useState<string | null>(url!);
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRefs = useRef<HTMLInputElement | null>(null);

  // Validar que 'window' esté disponible antes de declarar el esquema
  const fileDataSchema =
    typeof window !== "undefined"
      ? z.object({
          file: z
            .instanceof(File, { message: "Debe adjuntar un archivo" })
            .refine((file) => file.size > 0, "Debes cargar un archivo válido."),
        })
      : null;

  type TFileDataSchema =
    typeof fileDataSchema extends z.ZodObject<any>
      ? z.infer<typeof fileDataSchema>
      : { file: any };

  const form = useForm<TFileDataSchema>({
    resolver: fileDataSchema ? zodResolver(fileDataSchema) : undefined,
    defaultValues: undefined,
  });

  const onSubmit = async (data: TFileDataSchema) => {
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("driveFolderId", quota.driveFolderId!);
    formData.append("folderName", quota.folderName!);
    formData.append("quotaId", quota.id);
    formData.append("documentType", `${type}-Cuota-${quota.numberOfQuota}`);
    //@ts-ignore
    formData.append("file", data.file);

    try {
      const response = await fetch("/api/uploadToDrive", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir el archivo");
      }

      const result = await response.json();
      setUrlUploaded(result.webViewLink);

      toast({
        title: "Archivo subido correctamente",
        variant: "success",
      });

      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 500);
    } catch (error: any) {
      toast({
        title: "Error al subir el archivo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIconMainClick = () => {
    if (urlUploaded?.length) {
      window.open(urlUploaded, "_blank");
    } else {
      fileInputRefs.current?.click();
    }
  };

  const handleDeleteFile = async () => {
    if (!urlUploaded) {
      toast({
        title: "No hay archivo para eliminar",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch("/api/uploadToDrive", {
        method: "PUT",
        body: JSON.stringify({
          fileUrl: urlUploaded,
          folderId: quota.driveFolderId,
          quotaId: quota.id,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el archivo");
      }

      setUrlUploaded(null);

      toast({
        title: "Archivo eliminado correctamente",
        variant: "success",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error al eliminar el archivo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild >
          {editMode ? (
            <Pencil className="w-4" />
          ) : (
            <Button className="py-0 px-0 h-auto">{type}</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Actualizar la cuota</DialogTitle>
          </DialogHeader>
          <div className="w-full gap-4 py-4">
            <Form {...form}>
              <form
                className="flex flex-col gap-6 items-center text-center w-full"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label
                        className="text-start flex w-full"
                        htmlFor="upload"
                      >
                        {type}
                      </Label>
                      <FormControl>
                        <div
                          className={`w-full flex items-center justify-between rounded-lg border-[1px] bg-primary/15 ${
                            urlUploaded
                              ? "border-green-500"
                              : "border-[#E0DEF7]"
                          } cursor-pointer p-1 px-3 h-9`}
                        >
                          <div
                            className="flex gap-2 items-center w-full"
                            onClick={() => handleIconMainClick()}
                          >
                            {isUpdating ? (
                              <Loading />
                            ) : (
                              <LucidePaperclip className="w-6" />
                            )}
                            <p className="text-sm truncate w-full max-w-52 text-start">
                              {editMode
                                ? type
                                : field.value?.name
                                  ? field.value?.name
                                  : title}
                            </p>
                            <Input
                              ref={(ref) => {
                                if (ref) {
                                  fileInputRefs.current = ref;
                                }
                              }}
                              type="file"
                              id="file" // ID que coincide con el htmlFor
                              className="hidden w-full" // Opcional: Oculta el input pero sigue siendo accesible
                              multiple={false}
                              accept="/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(file); // Este archivo será del tipo correcto
                                }
                              }}
                              placeholder={`Subir ${type}`}
                            />
                          </div>

                          {urlUploaded ? (
                            <Button
                              type="button"
                              className="text-red-400 text-xl bg-transparent p-2 h-3 mb-1 hover:bg-transparent hover:text-red-600 ease-in-out transition-all duration-1000"
                              onClick={() => setIsDialogOpen(true)}
                            >
                              x
                            </Button>
                          ) : isUpdating && editMode ? (
                            <Loading />
                          ) : null}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isUpdating} type="submit">
                  {isUpdating ? "Actualizando..." : "Actualizar"}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>¿Seguro que deseas eliminar la url?</DialogTitle>
            <DialogDescription className="text-black">
              Se actualizará la cuota, borrando el {type} permanentemente.
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
              onClick={() => handleDeleteFile()}
              className="bg-primary duration-100 hover:bg-primary/80"
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

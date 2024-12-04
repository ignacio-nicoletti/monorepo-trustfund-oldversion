import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { TUrlSchema, urlSchema } from "./validations";
import { useState } from "react";

export default function linkDataController() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dataToDelete, setDataToDelete] = useState<{
    id: string | null;
    index: number | null;
  }>({ id: null, index: null });
  const form = useForm<TUrlSchema>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      urls: [
        {
          id: "",
          warrantorId: "",
          urlTypeId: "",
          url: "",
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "urls",
  });

  //Cargar el formulario con la informacion del solicitante/garantes
  const onSubmit = async (values: TUrlSchema, index: number) => {
    //actualizar el formulario del solicitante
    const singleUrl = values.urls[index];

    try {
      const res = await fetch("/api/urlSign", {
        method: "POST",
        body: JSON.stringify(singleUrl),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();

        form.setValue(`urls.${index}`, {
          ...data,
          urlTypeId: data.urlTypeId.toString(),
        }); // Actualiza solo el campo de la URL enviada
        toast({
          variant: "success",
          title:
            res.status === 200
              ? "Se actualizó la URL correctamente"
              : "Se agregó la URL correctamente",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error al ingresar la URL",
        });
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const deleteUrlFromDb = async (id: string, index: number) => {
    try {
      const res = await fetch(`/api/urlSign/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (res.ok) {
        if (index === 0 && form.getValues("urls")?.length === 1) {
          form.reset();
        } else {
          remove(index);
        }
        setIsDialogOpen(false);
        setDataToDelete({ id: null, index: null });
        toast({
          variant: "success",
          title: "Se eliminó la URL correctamente",
        });
      } else {
        setIsDialogOpen(false);
        setDataToDelete({ id: null, index: null });
        toast({
          variant: "destructive",
          title: "Error al ingresar la URL",
        });
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const deleteUrlFromLocalForm = async (index: number) => {
    if (index === 0) {
      form.reset();
      setIsDialogOpen(false);
      return;
    } else {
      remove(index);
      setIsDialogOpen(false);
      return;
    }
  };

  return {
    form,
    fields,
    append,
    remove,
    deleteUrlFromDb,
    deleteUrlFromLocalForm,
    onSubmit,
    isDialogOpen,
    setIsDialogOpen,
    dataToDelete,
    setDataToDelete,
  };
}

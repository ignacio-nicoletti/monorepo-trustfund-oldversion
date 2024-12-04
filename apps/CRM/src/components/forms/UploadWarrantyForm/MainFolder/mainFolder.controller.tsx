import { useForm } from "react-hook-form";
import { mainFolderDataSchema, TMainFolderDataSchema } from "./validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";

export default function mainFolderController(currentUrl?: string | undefined) {
  const { toast } = useToast();
  const form = useForm<TMainFolderDataSchema>({
    resolver: zodResolver(mainFolderDataSchema),
    defaultValues: {
      url: "",
    },
    mode: "onChange",
  });
  //Cargar el formulario con la informacion del solicitante/garantes
  const onSubmit = async (values: TMainFolderDataSchema) => {
    //actualizar el formulario del solicitante
    try {
      const res = await fetch("/api/mainFolders", {
        method: "POST",
        body: JSON.stringify({
          url: values.url,
        }),
        headers: {
          "Content-type": "aplication/json",
        },
      });
      if (res.ok) {
        let data: any = res.json();
        form.setValue("url", data.url);
        toast({
          variant: "success",
          title: "Se agrego la url correctamente",
        });
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          title: "Error al ingresar la url",
        });
      }
    } catch (error: any) {
      throw Error(error.messege);
    }
  };

  return {
    form,
    onSubmit,
  };
}

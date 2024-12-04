// validation

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { editOrganizationFormSchema } from "./EditOrganizationFormValidate";

export const EditOrganizationFormController = () => {
  const { toast } = useToast();
  const router = useRouter();
  // Crear formulario de react-form y pasarle el esquema implementado con ZOD
  const form = useForm<z.infer<typeof editOrganizationFormSchema>>({
    resolver: zodResolver(editOrganizationFormSchema),
    defaultValues: {
      id: "",
      type: "", //es el name
      logoUrl: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof editOrganizationFormSchema>) => {
    //crear usuario en la db
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/organization/${values.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "aplication/json",
      },
    });
    if (res.ok) {
      toast({
        variant: "success",
        title: "Organizacion creada correctamente.",
      });
      router.refresh();
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Error al crear la organizacion.",
        description: "algo salio mal",
      });
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    serverAction: (formData: FormData) => Promise<string | undefined>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append("files", files[0]!); // Si necesitas subir varios archivos, puedes hacer un loop
      const url = await serverAction(formData); // Llamamos la server action con el FormData

      if (url) form.setValue("logoUrl", url);
    }
  };

  const formValues = form.watch();
  return {
    form,
    formValues,
    onSubmit,
    handleFileChange,
  };
};

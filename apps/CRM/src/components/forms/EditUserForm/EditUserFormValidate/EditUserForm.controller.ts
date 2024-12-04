// validation

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { editUserFormSchema } from "./EditUserFormValidate";

export const editUserFormController = (id:string) => {
  const { toast } = useToast()
  const router = useRouter()
  // Crear formulario de react-form y pasarle el esquema implementado con ZOD
  const form = useForm<z.infer<typeof editUserFormSchema>>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      image_profile: ""
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof editUserFormSchema>) => {
    //crear usuario en la db
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "aplication/json",
      },
    });
    if (res.ok) {
      toast({
        variant: "success",
        title: "Perfil editado correctamente."
      });
      router.refresh()
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Error al editar perfil.",
        description: "algo salio mal",
      });
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, serverAction: (formData: FormData) => Promise<string | undefined>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append("files", files[0]!); // Si necesitas subir varios archivos, puedes hacer un loop
      const url = await serverAction(formData); // Llamamos la server action con el FormData

      if (url) form.setValue("image_profile", url)
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

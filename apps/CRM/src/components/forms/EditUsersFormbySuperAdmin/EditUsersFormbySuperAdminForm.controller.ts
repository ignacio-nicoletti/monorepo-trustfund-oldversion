// Importaciones
import { EditUsersFormbySuperAdminFormSchema } from "./EditUsersFormbySuperAdminFormValidate/EditUsersFormbySuperAdminFormValidate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { UserDataType } from "~/src/server-actions/users";

// Controlador del formulario de registro
export const registerFormController = (dataUser: UserDataType) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof EditUsersFormbySuperAdminFormSchema>>({
    resolver: zodResolver(EditUsersFormbySuperAdminFormSchema),
    defaultValues: {
      role: dataUser?.roleId?.toString() || "", // Asegúrate de que sea una cadena
      name: dataUser?.name || "",
      lastname: dataUser?.lastname || "",
      organization: dataUser?.organizationId?.toString() || "", // Convertido a cadena
      image_profile: dataUser?.image_profile || "",
      email: dataUser?.email || "",
      warrantiesWon: dataUser?.warrantiesWon?.toString() || "0",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof EditUsersFormbySuperAdminFormSchema>) => {
    const method = "PUT";
    const url = `/api/users/${dataUser?.id}`;

    const res = await fetch(url, {
      method,
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (res.ok) {
      toast({
        variant: "success",
        title: "Se editó el usuario correctamente",
      });
      form.reset();
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Error al editar el usuario",
        description: (await res.json()) || "Algo salió mal",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
  };

  return {
    form,
    onSubmit,
    handleFileChange,
  };
};

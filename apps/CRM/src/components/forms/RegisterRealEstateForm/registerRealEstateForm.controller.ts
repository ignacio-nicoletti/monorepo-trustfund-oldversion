// validation
import { registerFormSchema } from "./RegisterRealEstateFormValidate/RegisterRealEstateFormValidate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Session } from "next-auth";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { getInmoType } from "~/src/server-actions/inmobiliarias";

export interface Props {
  session: Session;
  editMode?: boolean;
  data: getInmoType;
}

export const registerRealEstateFormController = ({ session, editMode, data }: Props) => {
  
  const { toast } = useToast();
  // Crear formulario de react-form y pasarle el esquema implementado con ZOD
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      inmoAgent: editMode ? data?.inmobiliarias.inmoAgent || "" : "",
      // nombre de inmobiliaria
      name: editMode ? data?.inmobiliarias.name || "" : "",
      // nombre del responsable
      responsableId: editMode ? data?.inmobiliarias.responsableId! : session.user.id,
      // debe ser opcional
      phone: editMode ? data?.inmobiliarias.phone || "" : "",
      email: editMode ? data?.inmobiliarias.email || "" : "",
      web: editMode ? data?.inmobiliarias.web || "" : "",
      comment: editMode ? data?.inmobiliarias.comment || "" : "",
      // Addreses
      province: editMode ? data?.addresses?.province || "" : "",
      localidad: editMode ? data?.addresses?.city || "" : "",
      street: editMode ? data?.addresses?.street?.toString() || "" : "",
      intersectionOne: editMode ? data?.addresses?.intersectionOne?.toString() || "" : "",
      number: editMode ? data?.addresses?.number?.toString() || "" : "",
      intersectionTwo: editMode ? data?.addresses?.intersectionTwo?.toString() || "" : "",
      postal_code: editMode ? data?.addresses?.postalCode?.toString() || "" : "",
    },
    mode: editMode ? "onSubmit" : "onChange",
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    try {
      const payload = {
        values: values, // Wrap values under a `data` property
      };
      let url = editMode ? `/api/inmobiliarias/${data?.inmobiliarias.id}` : "/api/inmobiliarias";
      const res = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        body: JSON.stringify(editMode ? { id: data?.inmobiliarias.id, ...payload } : payload),
        headers: {
          "Content-Type": "application/json", // Fixed typo
        },
      });

      if (res.ok) {
        toast({
          variant: "success",
          title: editMode
            ? "Se actualizó la inmobiliaria correctamente"
            : "Se registró la inmobiliaria correctamente",
        });
        if (editMode) {
          form.reset();
        }
        form.reset();

        // Optionally refresh or redirect
        // router.refresh();
      } else {
        const errorMessage = await res.json();
        toast({
          variant: "destructive",
          title: editMode
            ? "Error al editar la inmobiliaria"
            : "Error al registrar la inmobiliaria",
          description: errorMessage?.message || "Algo salió mal",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error de red",
        description: error.message || "No se pudo conectar con el servidor.",
      });
    }
  };

  const formValues = form.watch();
  return {
    form,
    formValues,
    onSubmit,
  };
};

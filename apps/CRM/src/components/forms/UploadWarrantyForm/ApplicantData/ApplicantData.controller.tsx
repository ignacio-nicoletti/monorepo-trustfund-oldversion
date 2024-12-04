import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { usePathname } from "next/navigation";
import { TWarrantorsSchema, warrantorsSchema } from "./validations";


export const ApplicantDataController = () => {
    const { toast } = useToast();
    const location = usePathname();
    const warrantyId = location?.split("/").pop();

  // Configura useForm con el esquema de validación
  const form = useForm<TWarrantorsSchema>({
    resolver: zodResolver(warrantorsSchema),
    defaultValues: {
      warrantors: [
        {
          id: "",
          addressId: "",
          name: "",
          lastname: "",
          email: "",
          phone: "",
          dni: "",
          nacionality: "",
          isRequester: true,
          isOwner: false,
          province: "",
          city: "",
          street: "",
          intersectionOne: "",
          intersectionTwo: "",
          number: "",
          postal_code: "",
          driveFolderId: "",
          documentsData: undefined,
        },
      ],
    },
  });

  // Configuración de useFieldArray para el array de warrantors
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "warrantors", // Debe coincidir con el nombre en el esquema
  });

  // const formValues = form.watch();

  const onSubmitDataWarrantor = async () => {
    try {
      const res = await fetch("/api/warrantors", {
        method: "POST",
        body: JSON.stringify({
          warrantors: form.getValues("warrantors"), // Accede a warrantors directamente
          warrantyId: warrantyId,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      if (res.ok) {
        toast({
          variant: "success",
          title: "Se actualizo el formulario correctamente",
        });
        window.location.reload()
      } else {
        toast({
          variant: "destructive",
          title: "No se pudo actualizar el formulario",
          description: "Algo salió mal",
        });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return {
    form,
    fields,
    append,
    remove,
    onSubmitDataWarrantor,
  };
};

// validation

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";

import {
  RealStateValidateFormSchema,
  TRealStateValidateFormSchema,
} from "./realStateValidate/realStateValidate";

export const RealStateController = (idWarranty: any) => {
  const router = useRouter();
  const { toast } = useToast();

  // Crear formulario de react-form y pasarle el esquema implementado con ZOD
  const form = useForm<TRealStateValidateFormSchema>({
    resolver: zodResolver(RealStateValidateFormSchema),
    defaultValues: {
      id: "",
      name: "",
      inmoAgent: "",
      email: "",
      phone: "",
      province: "",
      city: "",
      street: "",
      intersectionOne: "",
      intersectionTwo: "",
      number: "",
      postal_code: "",
      apartment: "",
      country: "",
      // state: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof RealStateValidateFormSchema>
  ) => {
    let Url = values?.id?.length
      ? `/api/inmobiliarias/${values.id}`
      : `/api/inmobiliarias`;
    let method = values?.id?.length ? "PUT" : "POST";

    const res = await fetch(Url, {
      method: method,
      body: JSON.stringify({ values, idWarranty }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      toast({
        variant: "success",
        title: "Inmobiliaria creada correctamente.",
      });
      window.location.reload();
    } else {
      toast({
        variant: "destructive",
        title: "Error al crear inmobiliaria.",
        description: "algo salio mal",
      });
    }
  };

  return {
    form,
    onSubmit,
  };
};

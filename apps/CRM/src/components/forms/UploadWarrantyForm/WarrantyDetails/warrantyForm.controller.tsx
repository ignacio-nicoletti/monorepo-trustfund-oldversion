// Utilities
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { warrantyDetailsSchema } from "./validations/warrantyDetailsFormValidation";
import { WarrantyWithRelations } from "../ExtraComponents/returnTypes";
import { WarrantyDetails } from "./types/warrantyForm.types";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { useRouter } from "next/navigation";

export const warrantyDetailsFormController = (
  warrantyWithRelations?: WarrantyWithRelations | undefined
) => {
  const { toast } = useToast();
  const router = useRouter();

  // Crear formulario de react-form y pasarle el esquema implementado con ZOD
  const form = useForm<WarrantyDetails>({
    resolver: zodResolver(warrantyDetailsSchema),
    defaultValues: {
      // Garantia
      reservationAmount: "0",
      warrantyAmount: "0",
      warrantyAmountLessReservation: "0",
      contractDuration: "",
      financingTypeId: "1",
      currencyTypeId: "1",
      dollarTypeId: undefined,
      warrantyTypeId: "1",
      coverageTypeId: "1",
      contractInitDate: "",
      contractEndDate: "",
      reservationDate: "",
      userId: "",
      // Direcciones
      province: "",
      city: "",
      street: "",
      intersectionOne: "",
      intersectionTwo: "",
      number: "",
      postal_code: "",
      quotas: undefined, // Definición del array de cuotas
      documentsData: undefined,
      statusWarrantyId: 1,
    },
  });

  const onSubmit = async (values: WarrantyDetails) => {
    const res = await fetch(`/api/warranties/${warrantyWithRelations?.warranties.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
      cache: "no-store",
    });

    if (!res.ok) {
      const message: string = await res.json();
      toast({
        title: "Error al actualizar la garantía ❌",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Datos de la garantía actualizados ✅",
        variant: "success",
      });
      window.location.reload();
    }
  };

  return {
    form,
    onSubmit
  };
};

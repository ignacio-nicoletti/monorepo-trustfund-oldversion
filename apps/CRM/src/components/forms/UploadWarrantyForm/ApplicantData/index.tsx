import React, { useEffect, useState } from "react";
import { Label } from "@repo/ui/components/ui/label.tsx";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";
import { Form } from "@repo/ui/components/ui/form.tsx";
import { Input } from "@repo/ui/components/ui/input.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { ApplicantDataController } from "./ApplicantData.controller";
import { MockData } from "~/src/server-actions/getMocks";
import { WarrantiesWithRelations } from "../ExtraComponents/returnTypes";
import WarrantorSearchBar from "./WarrantorSearchBar/WarrantorSearchBar";
import InputNumber from "../../inputs/inputNumber";

interface WarrantorFields {
  number?: string;
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  dni?: string;
  nacionality?: string;
  isRequester?: boolean;
  isOwner?: boolean;
  province?: string;
  city?: string;
  street?: string;
  intersectionOne?: string;
  intersectionTwo?: string;
  postal_code?: string;
  driveFolderId?: string;
}
interface Props {
  mockData: MockData;
  warrantyDataState: WarrantiesWithRelations | undefined;
}

function ApplicantData({ warrantyDataState }: Props) {
  const { onSubmitDataWarrantor, form } = ApplicantDataController();
  const [warrantors, setWarrantors] = useState<number[]>([0]);

  //Si el formulario esta siendo editado va a setear el estado del form con la informacion ya existente
  useEffect(() => {
    const transformedWarrantors =
      warrantyDataState?.warrantorsWithRelations?.map((warrantor) => ({
        id: warrantor?.id || "",
        name: warrantor?.name || "",
        lastname: warrantor?.lastname || "",
        email: warrantor?.email || "",
        phone: warrantor?.phone || "",
        dni: warrantor?.dni || "",
        nacionality: warrantor?.nacionality || "",
        addressId: warrantor?.addressId || "",
        isRequester: warrantor.isRequester ? warrantor.isRequester : false,
        isOwner: warrantor.isOwner ? warrantor.isOwner : false,
        province: warrantor?.province || "",
        city: warrantor?.city || "",
        street: warrantor?.street || "",
        intersectionOne: warrantor?.intersectionOne || "",
        intersectionTwo: warrantor?.intersectionTwo || "",
        number: warrantor?.number?.toString() || "",
        postal_code: warrantor?.postal_code || "",
        documentsData: [],
      })) || [];

    if (transformedWarrantors.length > 0) {
      //@ts-ignore
      form.reset({ warrantors: transformedWarrantors });
      setWarrantors(
        Array.from({ length: transformedWarrantors.length }, (_, i) => i)
      ); // Ajusta el índice basado en el número de warrantors
    } else {
      setWarrantors([0]); // Por defecto, al menos un solicitante
    }
  }, [warrantyDataState]);

  //El formFiels va hacer mapeado en el formulario para armar los inputs.
  const formFields = [
    {
      field: "name",
      label: "Nombre",
      placeholder: "Nombre del solicitante",
      type: "text",
    },
    {
      field: "lastname",
      label: "Apellido",
      placeholder: "Apellido del solicitante",
      type: "text",
    },
    {
      field: "email",
      label: "Correo electrónico",
      placeholder: "Ingresá tu correo electrónico",
      type: "text",
    },
    {
      field: "phone",
      label: "Número de teléfono",
      placeholder: "Número de teléfono",
      type: "text",
    },
    {
      field: "dni",
      label: "DNI",
      placeholder: "DNI del solicitante",
      type: "text",
    },
    {
      field: "nacionality",
      label: "Nacionalidad",
      placeholder: "Nacionalidad del solicitante",
      type: "text",
    },
    {
      field: "province",
      label: "Provincia",
      placeholder: "Provincia",
      type: "text",
    },
    {
      field: "city",
      label: "Localidad",
      placeholder: "Localidad",
      type: "text",
    },
    {
      field: "street",
      label: "Calle principal",
      placeholder: "Calle principal",
      type: "text",
    },
    {
      field: "intersectionOne",
      label: "Intersección 1",
      placeholder: "Intersección 1",
      type: "text",
    },
    {
      field: "intersectionTwo",
      label: "Intersección 2",
      placeholder: "Intersección 2",
      type: "text",
    },
    {
      field: "number",
      label: "Número de propiedad",
      placeholder: "Número de propiedad",
      type: "text",
    },
    {
      field: "postal_code",
      label: "Código Postal",
      placeholder: "Código Postal",
      type: "number",
    },
  ];

  //Cargar informacion, llamado a la funcion del controller
  const handleSubmit = () => {
    onSubmitDataWarrantor();
  };

  //Agregar un nuevo warrantor al array de warrantors
  const addWarrantor = () => {
    if (warrantors.length < 10) {
      // Limita a 10 warrantors
      setWarrantors([...warrantors, warrantors.length]);
    }
  };

  // El type es para que el name del formfield acepte el valor dinamico,porq si no no se pone a llorar typescript
  type WarrantorFieldPath = `warrantors.${number}.${keyof WarrantorFields}`;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6 items-center text-center w-full"
      >
        {warrantors.map((index) => {
          const warrantorData = form.getValues(`warrantors.${index}`); // Obtener datos específicos de warrantor
          const title =
            index >= 2 && !warrantorData?.isRequester && !warrantorData?.isOwner
              ? ` Cogarante ${index - 1}`
              : warrantorData?.isOwner || index === 1
                ? " Propietario"
                : " solicitante";

          return (
            <fieldset
              key={index}
              className="border px-5 py-2 flex flex-col gap-5 text-end w-full rounded-lg border-foreground"
            >
              <legend className="hidden sm:inline w-auto">
                Datos del<strong>{title}</strong>
              </legend>
              {index !== 1 ? <WarrantorSearchBar /> : null}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 pb-5 gap-5">
                {formFields.map(({ field, label, placeholder }) => (                
                    <FormField
                      key={`${field}-${index}`}
                      control={form.control}
                      name={
                        `warrantors.${index}.${field}` as WarrantorFieldPath
                      }
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label
                            className="text-start flex w-full"
                            htmlFor={`${field}-${index}`}
                          >
                            {label}
                          </Label>
                          <FormControl>
                            {label !== "Número de teléfono" ? (
                              <Input
                                id={`${field}-${index}`}
                                placeholder={placeholder}
                                {...field}
                                value={
                                  (typeof field.value === "boolean"
                                    ? ""
                                    : (field.value ?? "")) as
                                    | string
                                    | number
                                    | readonly string[]
                                    | undefined
                                }
                              />
                            ) : (
                              <InputNumber
                                id={`${field}-${index}`}
                                placeHolder={placeholder}
                                {...field}
                                value={
                                  (typeof field.value === "boolean"
                                    ? ""
                                    : (field.value ?? "")) as
                                    | string
                                    | number
                                    | undefined
                                }
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            </fieldset>
          );
        })}
        <div className="w-full flex flex-col sm:flex-row gap-5 justify-end">
          <Button
            type="button"
            onClick={addWarrantor}
            className="bg-primary duration-100 hover:bg-primary/80"
            disabled={warrantors.length >= 10} // Deshabilitar cuando se alcanza el límite
          >
            Agregar un garante
          </Button>
          <Button
            type="submit"
            className="bg-primary duration-100 hover:bg-primary/80"
          >
            Cargar datos
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ApplicantData;

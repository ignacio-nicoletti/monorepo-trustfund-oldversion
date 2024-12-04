import React, { useEffect } from "react";
import { Label } from "@repo/ui/components/ui/label.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";
import { Input } from "@repo/ui/components/ui/input.tsx";
import Searchbar from "~/src/components/searchBar/SearchBar";
import InputNumber from "@components/forms/inputs/inputNumber";
import { RealStateController } from "./realState.controller";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { WarrantyWithRelations } from "../ExtraComponents/returnTypes";
interface RealEstateDataProps {
  idInmobiliaria: string | undefined;
  idWarranty: string | undefined;
  dataInmo: WarrantyWithRelations | undefined;
}

const RealEstateData: React.FC<RealEstateDataProps> = ({
  idInmobiliaria,
  idWarranty,
  dataInmo,
}) => {
  const { form, onSubmit } = RealStateController(idWarranty);

  useEffect(() => {
    const handleSearchSelect = async (id: string) => {
      try {
        if (dataInmo?.inmobiliarias?.id) {
          // Llenar los campos del formulario con los datos obtenidos
          form.setValue("id", dataInmo.inmobiliarias.id || "");
          form.setValue("name", dataInmo.inmobiliarias.name || "");
          form.setValue("inmoAgent", dataInmo.inmobiliarias.inmoAgent || "");
          form.setValue("email", dataInmo.inmobiliarias.email || "");
          form.setValue("phone", dataInmo.inmobiliarias.phone || "");
          form.setValue("province", dataInmo?.inmobiliarias?.addresses?.province ?? "");
          form.setValue("city", dataInmo?.inmobiliarias?.addresses?.city ?? "");
          form.setValue("street", dataInmo?.inmobiliarias?.addresses?.street ?? "");
          form.setValue("country", dataInmo?.inmobiliarias?.addresses?.country ?? "");
          form.setValue(
            "intersectionOne",
            dataInmo?.inmobiliarias?.addresses?.intersectionOne ?? ""
          );
          form.setValue(
            "intersectionTwo",
            dataInmo?.inmobiliarias?.addresses?.intersectionTwo ?? ""
          );
          form.setValue("number", dataInmo?.inmobiliarias?.addresses?.number?.toString() ?? "");
          form.setValue(
            "postal_code",
            dataInmo?.inmobiliarias?.addresses?.postalCode?.toString() ?? ""
          );
        }
      } catch (error) {
        console.error("Error fetching full data:", error);
      }
    };
    if (idInmobiliaria) {
      handleSearchSelect(idInmobiliaria);
    }
  }, [idInmobiliaria]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 items-center  text-center w-full"
      >
        <fieldset className="border px-5 py-2 text-end  rounded-lg border-foreground w-full">
          <legend className="hidden my-5 sm:inline w-auto">
            Datos de la <strong>inmobiliaria</strong>
          </legend>
          <div>
            <Searchbar form={form} />
          </div>

          <div className=" grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8  py-5  gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="web">
                    Nombre de la inmobiliaria
                  </Label>
                  <FormControl>
                    <Input placeholder="Nombre de la inmobiliaria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inmoAgent"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="web">
                    Nombre del agente
                  </Label>
                  <FormControl>
                    <Input placeholder="Nombre del agente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="email">
                    Correo electrónico{" "}
                  </Label>
                  <FormControl>
                    <Input placeholder="Ingresá tu correo electrónico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="phone">
                    Número de teléfono
                  </Label>
                  <FormControl>
                    <InputNumber id={"phone"} placeHolder="Número de teléfono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="country">
                    Pais{" "}
                  </Label>
                  <FormControl>
                    <Input placeholder="Pais" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="province">
                    Provincia{" "}
                  </Label>
                  <FormControl>
                    <Input placeholder="Provincia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="city">
                    Ciudad{" "}
                  </Label>
                  <FormControl>
                    <Input placeholder="Ciudad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="state">
                    Estado{" "}
                  </Label>
                  <FormControl>
                    <Input placeholder="Estado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="street">
                    Calle principal{" "}
                  </Label>
                  <FormControl>
                    <Input placeholder="Calle principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intersectionOne"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="intersectionOne">
                    Interseccion 1{" "}
                  </Label>
                  <FormControl>
                    <Input placeholder="Interseccion 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intersectionTwo"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="intersectionTwo">
                    Interseccion 2
                  </Label>
                  <FormControl>
                    <Input placeholder="Interseccion 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="number">
                    Número de propiedad
                  </Label>
                  <FormControl>
                    <InputNumber id={"number"} placeHolder="Número de propiedad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="postal_code">
                    Código Postal
                  </Label>
                  <FormControl>
                    <InputNumber id={"postal_code"} placeHolder="Código Postal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="bg-primary  duration-100 hover:bg-primary/80">Cargar datos</Button>
        </fieldset>
      </form>
    </Form>
  );
};

export default RealEstateData;

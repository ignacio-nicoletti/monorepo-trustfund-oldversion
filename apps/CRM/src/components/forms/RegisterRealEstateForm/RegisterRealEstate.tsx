"use client";

// ui
import { Input } from "@repo/ui/components/ui/input.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import InputNumber from "@components/forms/inputs/inputNumber";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";

// hooks
import { registerRealEstateFormController } from "./registerRealEstateForm.controller";
import { Label } from "@repo/ui/components/ui/label.tsx";
import { Session } from "next-auth";
import { getInmoType } from "~/src/server-actions/inmobiliarias";

export interface Props {
  session: Session;
  searchParams?: { [key: string]: string | undefined };
  data: getInmoType;
}

function RegisterRealEstate({ session, searchParams, data }: Props) {
  let editMode = searchParams?.editMode === "true";
  const { form, onSubmit } = registerRealEstateFormController({
    session,
    editMode,
    data,
  });

  return (
    <section className="flex w-full p-0 m-0 ">
      <div className="w-full flex flex-col">
        <div className=" flex justify-center items-center w-full mx-auto">
          <div className="w-full  flex flex-col gap-6">
            <h1 className="text-4xl font-bold leading-10 tracking-tighter">
              {editMode ? "Editar" : "Registro de"} inmobiliaria
            </h1>
            <p className="text-base text-slate-500 font-medium">
              {editMode
                ? "Modificá en el sistema a una inmobiliaria."
                : "Carga en el sistema a una inmobiliaria."}
            </p>
            {/* Formulario de shadcn-react-hook-form */}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6 items-center text-center w-full"
              >
                <fieldset className="border  text-left w-full grid grd-rows-3 grid-cols-1 gap-5 p-5 rounded-lg border-foreground">
                  <legend className="hidden sm:inline w-auto">
                    Datos de contacto de la<strong> inmobiliaria </strong>
                  </legend>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-5">
                    <FormField
                      control={form.control}
                      name="inmoAgent"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="inmoAgent">
                            Nombre del asesor
                          </Label>
                          <FormControl>
                            <Input placeholder="Nombre del asesor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="name">
                            Nombre de la inmobiliaria *
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
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="email">
                            Correo electrónico *
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
                      name="web"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="web">
                            Link de la web
                          </Label>
                          <FormControl>
                            <Input placeholder="www.web-example.com" {...field} />
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
                            Provincia *
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
                      name="localidad"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="localidad">
                            Localidad
                          </Label>
                          <FormControl>
                            <Input placeholder="Localidad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="street">
                            Calle principal *
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
                            Interseccion 1 *
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
                            <InputNumber
                              id={"number"}
                              placeHolder="Número de propiedad"
                              {...field}
                            />
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
                            <InputNumber
                              id={"postal_code"}
                              placeHolder="Código Postal"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="comment">
                            Agrega un comentario
                          </Label>
                          <FormControl>
                            <Input placeholder="Agrega un comentario" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-5">
                    <Button variant="ghost">Limpiar campos</Button>
                    <Button
                      type="submit"
                      className="bg-primary duration-100 hover:bg-primary/80"
                      disabled={!form.formState.isValid}
                    >
                      Registrar
                    </Button>
                  </div>
                </fieldset>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterRealEstate;

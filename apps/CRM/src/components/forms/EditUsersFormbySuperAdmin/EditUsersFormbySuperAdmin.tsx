"use client";;
// ui
import { Input } from "@repo/ui/components/ui/input.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@repo/ui/components/ui/form.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select.tsx";

// hooks
import { registerFormController } from "./EditUsersFormbySuperAdminForm.controller";
import { Label } from "@repo/ui/components/ui/label.tsx";
import { UserDataType } from "~/src/server-actions/users";
import { MockData } from "../../../server-actions/getMocks/index";
import { useSession } from "next-auth/react";
import { InputFile } from "../inputs/inputFile";

function EditUsersFormbySuperAdmin({
  dataUser,
  mockData,
  id,
}: {
  dataUser: UserDataType;
  mockData: MockData;
  id: string;
}) {
  const { form, onSubmit, handleFileChange } = registerFormController(dataUser);
  const { data: session } = useSession();

  return (
    <section className="flex w-full p-0 m-0 ">
      <div className="w-full flex flex-col">
        <div className=" flex justify-center items-center w-full mx-auto">
          <div className="w-full  flex flex-col gap-6">
            <h1 className="text-4xl font-bold leading-10 tracking-tighter">{"Editar usuario"}</h1>
            <p className="text-base text-slate-500 font-medium">Editar en el sistema al usuario.</p>
            {/* Formulario de shadcn-react-hook-form */}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6 items-center  text-center w-full"
              >
                <fieldset className="border  text-left w-full grid grd-rows-3 grid-cols-1 gap-5 p-5 rounded-lg border-foreground">
                  <legend className="hidden sm:inline w-auto">
                    Datos de <strong> {dataUser?.name + " " + dataUser?.lastname}</strong>
                  </legend>
                  <div className="grid grid-rows-1">
                    <FormField
                      control={form.control}
                      name="image_profile"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <InputFile textLabel="Cargá una foto de perfil" onChange={handleFileChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="name">
                            Nombre *
                          </Label>
                          <FormControl>
                            <Input placeholder="Ingresá tu nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="lastname">
                            Apellido *
                          </Label>
                          <FormControl>
                            <Input placeholder="Ingresá tu apellido" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="role">
                            Tipo de usuario *
                          </Label>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange} // Asigna el valor seleccionado
                              value={field.value} // Muestra el valor actual en el formulario
                              disabled={id === session?.user.id}
                            >
                              <SelectTrigger className="w-full bg-primary/15 border-primary/30">
                                <SelectValue placeholder="Seleccione una opción" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {mockData?.rolesTypes?.map((el) => (
                                    <SelectItem key={el.id} value={el.id.toString()}>
                                      {el.type}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control} // Conecta el control de react-hook-form
                      name="organization" // El nombre del campo que usará el formulario
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="organization">
                            Tipo de organización *
                          </Label>
                          <FormControl>
                            <Select
                              // Pasar al Select los valores de react-hook-form
                              onValueChange={field.onChange} // Almacena el valor ID seleccionado
                              value={field.value} // Muestra el valor actual seleccionado en el form
                            >
                              <SelectTrigger className="w-full bg-primary/15 border-primary/30">
                                <SelectValue placeholder="Seleccione una opción" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {mockData && mockData?.organizationsTypes?.length
                                    ? mockData?.organizationsTypes.map((el: any) => (
                                        <SelectItem key={el.id} value={el.id.toString()}>
                                          {el.type}
                                        </SelectItem>
                                      ))
                                    : null}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
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
                            <Input placeholder="Ingresá tu correo electrónico" {...field} value={field.value} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="warrantiesWon"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-start flex w-full" htmlFor="warrantiesWon">
                            Ventas
                          </Label>
                          <FormControl>
                            <Input id="warrantiesWon" placeholder="Ventas del usuario" {...field} value={field.value} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="m-auto bg-primary w-full md:w-1/2 duration-100 hover:bg-primary/80"
                    disabled={!form.formState.isValid}
                  >
                    {"Editar"}
                  </Button>
                </fieldset>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditUsersFormbySuperAdmin;

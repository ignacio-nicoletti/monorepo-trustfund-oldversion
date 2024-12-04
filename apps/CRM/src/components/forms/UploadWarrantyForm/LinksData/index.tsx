import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";
import InputSelect, { Item } from "@components/forms/inputs/inputSelect";
import { Input } from "@repo/ui/components/ui/input.tsx";
import { MockData } from "~/src/server-actions/getMocks";
import { WarrantiesWithRelations, URLSign } from "../ExtraComponents/returnTypes";
import { usePathname } from "next/navigation";
import linkDataController from "./linkData.controller";
import { Label } from "@repo/ui/components/ui/label.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog.tsx";

interface Props {
  mockData: MockData;
  data: WarrantiesWithRelations | undefined;
}

function LinksData({ mockData, data }: Props) {
  const urlTypes: Item[] =
    mockData?.urlTypes.map((elem: any) => ({
      id: elem.id.toString(),
      type: elem.type,
    })) || [];

  const location = usePathname();
  const warrantyId = location?.split("/").pop();

  const [warrantors, setWarrantors] = useState<Item[]>([]);

  const {
    form,
    fields,
    append,
    deleteUrlFromDb,
    deleteUrlFromLocalForm,
    onSubmit,
    isDialogOpen,
    setIsDialogOpen,
    dataToDelete,
    setDataToDelete,
  } = linkDataController();

  useEffect(() => {
    if (warrantyId && data?.warrantorsWithRelations) {
      if (data?.warrantorsWithRelations.length) {
        const warrantorItems: Item[] = data?.warrantorsWithRelations.map((elem) => ({
          id: elem?.id!.toString(),
          type: `${elem?.name} ${elem?.lastname}`,
        }));

        let urlFromDb: URLSign[] = [];
        data.warrantorsWithRelations.forEach((elem) => {
          if (elem?.urlSign?.length) {
            urlFromDb.push(...elem.urlSign);
          }
        });

        if (urlFromDb.length) {
          let urlsParsed = urlFromDb.map((elem) => ({
            ...elem,
            urlTypeId: elem?.urlTypeId?.toString(),
          }));
          form.setValue("urls", urlsParsed);
        }
        setWarrantors(warrantorItems);
      }
    }

    return () => {
      setWarrantors([]);
    };
  }, [data?.warrantorsWithRelations, warrantyId]);

  const addLink = () => {
    append({
      id: "",
      url: "",
      warrantorId: "",
      urlTypeId: "",
    });
  };

  return (
    <>
      {fields.map((field: any, index) => (
        <Form {...form} key={index}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit((values) => onSubmit(values, index))(e);
            }}
            className="flex flex-col gap-6 items-center text-center w-full"
          >
            <fieldset
              key={field.id}
              className="border px-5 py-2 text-end rounded-lg border-foreground w-full"
            >
              <legend className="hidden sm:inline w-auto">
                Adjuntar <strong>link {index + 1}</strong>
              </legend>
              <div className="grid md:grid-cols-4 py-5 grid-cols-1 gap-5 text-left">
                {/* urlType Field */}
                <FormField
                  control={form.control}
                  name={`urls.${index}.urlTypeId`}
                  render={({ field }: any) => (
                    <FormItem className="w-full">
                      <Label htmlFor={field.name} className="text-start flex w-full">
                        Tipos de firma
                      </Label>
                      <FormControl>
                        <InputSelect
                          isDisabled={false}
                          items={urlTypes}
                          placeHolder="Seleccione tipo de firma"
                          value={field.value}
                          onChange={field.onChange}
                          id={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* warrantorId Field */}
                <FormField
                  control={form.control}
                  name={`urls.${index}.warrantorId`}
                  render={({ field }: any) => (
                    <FormItem className="w-full">
                      <Label htmlFor={field.name} className="text-start flex w-full">
                        Garantes
                      </Label>
                      <FormControl>
                        <InputSelect
                          isDisabled={false}
                          items={warrantors}
                          placeHolder="Seleccione una persona"
                          value={field.value}
                          onChange={field.onChange}
                          id={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* url Field */}
                <FormField
                  control={form.control}
                  name={`urls.${index}.url`}
                  render={({ field }: any) => (
                    <FormItem className="w-full">
                      <Label htmlFor={field.name} className="text-start flex w-full">
                        Adjuntar link
                      </Label>
                      <FormControl>
                        <Input placeholder="Ingresá un link a firmar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row gap-3 justify-end ">
                <Button type="submit" className="bg-primary duration-100 hover:bg-primary/80">
                  {form.getValues(`urls.${index}.id`)?.length ? "Actualizar url" : "Cargar url"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(true);
                    setDataToDelete({
                      id: form.getValues(`urls.${index}.id`)?.length
                        ? form.getValues(`urls.${index}.id`)!
                        : null,
                      index: index,
                    });
                  }}
                  className="bg-red-500 duration-100 hover:bg-red-400"
                >
                  Eliminar link
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>¿Seguro que deseas eliminar la url?</DialogTitle>
                      <DialogDescription className="text-black">
                        Se actualizará el estado del formulario al aceptar. index:{" "}
                        {dataToDelete.index}, id: {dataToDelete.id}
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="destructive" type="button">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button
                        type="button"
                        onClick={() =>
                          form.getValues(`urls.${index}.id`)?.length
                            ? deleteUrlFromDb(dataToDelete.id!, dataToDelete.index!)
                            : deleteUrlFromLocalForm(dataToDelete.index!)
                        }
                        className="bg-primary duration-100 hover:bg-primary/80"
                      >
                        Aceptar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </fieldset>
          </form>
        </Form>
      ))}

      <div className="flex items-center justify-end gap-4 w-full">
        <Button
          type="button"
          onClick={addLink}
          className="bg-primary duration-100 hover:bg-primary/80"
        >
          Agregar otro link
        </Button>
      </div>
    </>
  );
}

export default LinksData;

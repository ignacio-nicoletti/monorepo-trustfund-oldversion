"use client";
import React, { useRef, useState, ChangeEvent } from "react";
import { Input } from "@repo/ui/components/ui/input.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";
import { Label } from "@repo/ui/components/ui/label.tsx";
import { uploadFiles } from "~/src/server-actions";
import { useRouter } from "next/navigation";
import { EditOrganizationFormController } from "./EditOrganizationFormValidate/EditOrganizationForm.controller";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select.tsx";
import { InputFile } from "../../inputs/inputFile";

interface Organizations {
  id: number;
  type: string | null;
  logoUrl: string | null;
}

interface EditOrganizationFormProps {
  organizations: Organizations[] | undefined;
}

const EditOrganizationForm: React.FC<EditOrganizationFormProps> = ({ organizations }) => {
  const router = useRouter();
  const { form, onSubmit } = EditOrganizationFormController();

  const [uploadedMainImage, setUploadedMainImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputMainRef = useRef<HTMLInputElement>(null);

  const handleFileMainChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setUploadedMainImage(imageUrl);
    }
  };

  const handleDeleteImagePrimary = () => {
    setUploadedMainImage(null);
    setSelectedFile(null);
    form.setValue("logoUrl", "");
    if (fileInputMainRef.current) fileInputMainRef.current.value = "";
  };

  const handleSubmit = async (data: any) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("files", selectedFile);

      try {
        const uploadedUrl = await uploadFiles(formData);
        if (uploadedUrl) {
          data.logoUrl = uploadedUrl;
          setUploadedMainImage(null);
          setSelectedFile(null);
          await onSubmit(data);
          router.refresh();
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    } else {
      await onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6 items-center text-center w-full"
      >
        <fieldset className="border text-left w-full grid grid-cols-1 gap-5 p-5 rounded-lg border-foreground">
          <legend className="hidden sm:inline w-auto">
            Edita los datos de una<strong> organización </strong>
          </legend>
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="type">
                    Organizacion *
                  </Label>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        const selectedOrganization = organizations?.find(
                          (org) => org.type === value
                        );
                        if (selectedOrganization) {
                          form.setValue("id", selectedOrganization.id.toString() || "");
                          form.setValue("type", selectedOrganization.type || "");
                          form.setValue("logoUrl", selectedOrganization.logoUrl || "");
                          setUploadedMainImage(selectedOrganization.logoUrl || null);
                        }
                      }}
                      value={form.watch("type")}
                    >
                      <SelectTrigger className="w-full bg-primary/15 border-primary/30">
                        <SelectValue placeholder="Seleccione una organizacion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {organizations?.map((el) => (
                            <SelectItem key={el.id} value={el.type!}>
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
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="logoUrl"
                render={() => (
                  <FormItem className="h-auto gap-0">
                    <FormControl>
                      {uploadedMainImage ? (
                        <div className="relative flex w-full max-w-sm items-center gap-1.5">
                          <div className="relative flex items-center justify-center w-20 h-20 rounded-full border border-[#E0DEF7] bg-gray-100 overflow-hidden">
                            <img
                              src={uploadedMainImage}
                              alt="Vista previa de la imagen de perfil"
                              className="w-full h-full object-cover rounded-full"
                            />
                            <button
                              type="button"
                              onClick={handleDeleteImagePrimary}
                              className="absolute top-0 right-0 w-20 h-20 text-transparent hover:text-black rounded-full p-1 hover:text-xl ease-in-out transition-all duration-150"
                            >
                              ✕
                            </button>
                          </div>
                          <Label htmlFor="picture" className="ml-2 text-base">
                            {"Cargá una foto de perfil"}
                          </Label>
                        </div>
                      ) : (
                        <InputFile
                          textLabel="Cargá un logo de la organización"
                          onChange={handleFileMainChange}
                          ref={fileInputMainRef}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="type">
                    Nombre de la organización *
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="Ingresa el nombre de la organización"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={!form.watch("id")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="ml-auto bg-primary w-full md:w-1/3 duration-100 hover:bg-primary/80"
            disabled={form.getValues("type")===""}
          >
            Editar
          </Button>
        </fieldset>
      </form>
    </Form>
  );
};

export default EditOrganizationForm;
;

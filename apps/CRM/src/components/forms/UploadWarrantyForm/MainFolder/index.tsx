import { Input } from "@repo/ui/components/ui/input.tsx";
import React, { useEffect, useState } from "react";
import { MockData } from "~/src/server-actions/getMocks";
import { getCurrentMainFolderUrl } from "./helpers";
import mainFolderController from "./mainFolder.controller";
import { Button } from "@repo/ui/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";
import { Label } from "@repo/ui/components/ui/label.tsx";

interface Props {
  mockData: MockData;
}

function MainFolder({ mockData }: Props) {
  const [currentUrl] = useState(
    getCurrentMainFolderUrl(mockData)
  );
  
  const { form, onSubmit } = mainFolderController(currentUrl);

  useEffect(() => {
    if (currentUrl && !form.getValues("url")?.length) {
      form.reset({ url: currentUrl });
    }
  }, [currentUrl]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:w-1/4 flex-row flex gap-2"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Pegar URL" {...field} />
              </FormControl>
              <Label
                htmlFor={field.name}
                className="text-start flex w-full text-xs"
              >
                Para poder adjuntar archivos debe adjuntarse la url de la
                carpeta de este mes/año, ya que dentro se creará la subcarpeta
                del solicitante.
              </Label>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-primary duration-100 hover:bg-primary/80"
        >
          Cargar
        </Button>
      </form>
    </Form>
  );
}

export default MainFolder;

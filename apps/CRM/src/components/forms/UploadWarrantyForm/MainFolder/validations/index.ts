import { z } from "zod";

export const mainFolderDataSchema = z.object({
    url: z.string().min(10, { message: "Debe ingresar la url de la carpeta principal." }),
  });

export type TMainFolderDataSchema = z.infer<typeof mainFolderDataSchema>
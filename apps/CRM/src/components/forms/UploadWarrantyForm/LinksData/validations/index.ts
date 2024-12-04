import { z } from "zod";

export const linksDataSchema = z.object({
  id: z.string().optional().nullable(),
  url: z
    .string()
    .min(10, { message: "Debe ingresar la url correspondiente." }),
  warrantorId: z
    .string()
    .min(5, { message: "Debe ingresar el nombre del solicitante/garante." }),
  urlTypeId: z.string().min(1, { message: "Debe ingresar el tipo de firma." }),
}).optional();

export const urlSchema = z.object({
  urls: z.array(linksDataSchema),
});

export type TLinksDataSchema = z.infer<typeof linksDataSchema>;
export type TUrlSchema = z.infer<typeof urlSchema>;

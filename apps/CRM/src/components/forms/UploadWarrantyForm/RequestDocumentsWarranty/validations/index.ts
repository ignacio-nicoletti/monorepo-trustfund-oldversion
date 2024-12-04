import { z } from "zod";

// Define tu esquema de validación usando zod
export const DocumentFormSchema = z.object({
  mainFolderUrl: z.string().optional(),
  driveFolderId: z.string().optional(),
  folderName: z.string().optional(),
  warrantorId: z.string().optional(),
  documentsData: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string().optional(),
      name: z.string().optional(),
      file: z.any().optional(),
      warrantyDocumentTypesId: z.number().optional(),
      warrantyId: z.string().optional(),
    })
  ),
});

export type DocumentFormValues = z.infer<typeof DocumentFormSchema>;

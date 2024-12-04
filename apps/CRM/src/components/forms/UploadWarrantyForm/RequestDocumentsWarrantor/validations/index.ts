import { z } from "zod";

// Define tu esquema de validación usando zod
export const DocumentFormSchema = z.object({
    mainFolderUrl: z.string().optional(),
    driveFolderId: z.string().optional(),
    folderName: z.string().optional(),
    warrantors: z.array(
      z.object({
        id: z.string(),
        warrantorName: z.string().optional(),
        isRequester: z.boolean().default(false),
        documentsData: z.array(
          z.object({
            id: z.string().optional(),
            url: z.string().optional(),
            name: z.string().optional(),
            file: z.any().optional(),
            warrantorDocumentTypesId: z.number().optional(),
            warrantorId: z.string().optional(),
          })
        ),
      })
    ),
  });
  
  export type DocumentFormValues = z.infer<typeof DocumentFormSchema>;
  
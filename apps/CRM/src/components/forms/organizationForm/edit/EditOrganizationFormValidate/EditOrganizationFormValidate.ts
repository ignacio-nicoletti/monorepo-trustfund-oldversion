import { z } from "zod";
export const editOrganizationFormSchema = z.object({
  id:z.string().optional(),
  logoUrl: z.string().optional(),
  type: z.string(),
});

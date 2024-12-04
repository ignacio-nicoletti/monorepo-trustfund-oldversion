import { z } from "zod";
export const registeOrganizationFormSchema = z.object({
  logoUrl: z.string().optional(),
  type: z.string(),
});

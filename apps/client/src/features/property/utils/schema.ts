import { z } from "zod";

export const createPropertyFormSchema = z.object({
  name: z.string().min(2, "Name should be atleast 2 characters."),
  ownerName: z.string(),
  ownerContact: z.string(),
  monthlyRent: z.string(),
  securityDeposit: z.string(),
});

export const PropertySearchSchema = z.object({
  page: z.coerce.number().catch(1).optional(),
  limit: z.coerce.number().catch(10).optional(),
  sortBy: z.enum(["monthlyRent", "createdAt", "updatedAt", "name"]).catch("createdAt").optional(),
  sortOrder: z.enum(["asc", "desc"]).catch("desc").optional(),
  search: z.string().optional(),
  minRent: z.coerce.number().optional(),
  maxRent: z.coerce.number().optional(),
})

export type PropertySearch = z.infer<typeof PropertySearchSchema>;
export type CreateProperty = z.infer<typeof createPropertyFormSchema>;

import { z } from "zod";

export const createPropertyFormSchema = z.object({
  name: z.string().min(2, "Name should be atleast 2 characters."),
  ownerName: z.string(),
  ownerContact: z.string(),
  monthlyRent: z.string(),
  securityDeposit: z.string(),
});

export type CreateProperty = z.infer<typeof createPropertyFormSchema>;

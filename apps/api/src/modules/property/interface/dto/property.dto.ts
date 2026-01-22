import { z } from "zod";

export const createPropertySchema = z.object({
  name: z.string(),
  ownerName: z.string(),
  ownerContact: z.string(),
  monthlyRent: z.string(),
  securityDeposit: z.string(),
  images: z.array(
    z.object({
      id: z.string(),
    }),
  ),
});

export type CreatePropertyPayload = z.infer<typeof createPropertySchema>;

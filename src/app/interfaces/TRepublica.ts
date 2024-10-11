import z from "zod";

export const TRepublicaSchema = z.object({
  id: z.number(),
  description: z.string(),
  neighborhood: z.string(),
  ownerRepublic: z.string(),
  valueRepublic: z.number(),
  city: z.string(),
  address: z.string(),
  campus_id: z.number(),
});

export type TRepublica = z.infer<typeof TRepublicaSchema>;

import z from "zod";

export const TCampusSchema = z.object({
  id: z.number(),
  description: z.string(),
});

export type TCampus = z.infer<typeof TCampusSchema>;

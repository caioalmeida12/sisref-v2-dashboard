import z from "zod";

export const TTurnoSchema = z.object({
  id: z.number(),
  description: z.string(),
  campus_id: z.number(),
});

export type TTurno = z.infer<typeof TTurnoSchema>;

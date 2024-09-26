import { z } from "zod";

export const TCursoSchema = z.object({
  id: z.number(),
  description: z.string(),
  initials: z.string(),
  campus_id: z.number(),
});

export type TCurso = z.infer<typeof TCursoSchema>;

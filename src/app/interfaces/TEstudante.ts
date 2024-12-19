import { z } from "zod";
import { TCursoSchema } from "./TCurso";
import { TUsuarioSchema } from "./TUsuario";
import { TTurnoSchema } from "./TTurno";

export const TEstudanteSchema = z.object({
  id: z.number(),
  name: z.string(),
  mat: z.string(),
  course_id: z.number(),
  shift_id: z.number().nullable(),
  campus_id: z.number(),
  photo: z.string().nullable(),
  observation: z.string().nullable(),
  republic: z.boolean().nullable(),
  block: z.boolean().nullable(),
  active: z.number().transform(Boolean),
  dateValid: z.string(),
  semRegular: z.number(),
  hasKey: z.number().transform(Boolean),
  // Esses valores de máximo e mínimo foram hardcoded pelo backend, quando houver atualização lá, tem que fazer manual aqui
  cabinet: z.number().min(1).max(44).nullable().default(null),
  key: z.number().min(1).max(12).nullable().default(null),
});

export const TEstudanteComCursoSchema = TEstudanteSchema.extend({
  course: TCursoSchema,
});

export const TEstudanteComCursoTurnoEUsuarioSchema = TEstudanteSchema.extend({
  shift: TTurnoSchema.nullable(),
  user: z.array(TUsuarioSchema),
  course: TCursoSchema,
});

export type TEstudante = z.infer<typeof TEstudanteSchema>;
export type TEstudanteComCurso = z.infer<typeof TEstudanteComCursoSchema>;
export type TEstudanteComCursoTurnoEUsuario = z.infer<
  typeof TEstudanteComCursoTurnoEUsuarioSchema
>;

import { z } from "zod";
import { TCursoSchema } from "./TCurso";

export const TEstudanteSchema = z.object({
    id: z.number(),
    name: z.string(),
    mat: z.string(),
    course_id: z.number(),
    shift_id: z.number(),
    campus_id: z.number(),
    photo: z.string().nullable(),
    observation: z.string().nullable(),
    republic: z.boolean().nullable(),
    block: z.boolean().nullable(),
    active: z.number().transform(Boolean),
    dateValid: z.string(),
    semRegular: z.number(),
})

export const TEstudanteComCursoSchema = TEstudanteSchema.extend({
    course: TCursoSchema
})

export type TEstudante = z.infer<typeof TEstudanteSchema>;
export type TEstudanteComCurso = z.infer<typeof TEstudanteComCursoSchema>;
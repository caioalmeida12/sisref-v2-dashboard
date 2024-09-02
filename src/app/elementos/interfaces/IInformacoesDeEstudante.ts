import { z } from "zod";

export const IInformacoesDeEstudanteSchema = z.object({
    id: z.number(),
    active: z.number(),
    dateValid: z.string(),
    mat: z.string(),
    name: z.string(),
    semRegular: z.number(),
    course_id: z.number(),
    shift_id: z.number(),
    photo: z.string().nullable(),
    campus_id: z.number(),
    observation: z.string().nullable(),
    republic: z.string().nullable(),
    block: z.string().nullable(),
    course: z.object({
        id: z.number(),
        description: z.string(),
        initials: z.string(),
        campus_id: z.number()
    })
});

export type IInformacoesDeEstudante = z.infer<typeof IInformacoesDeEstudanteSchema>;
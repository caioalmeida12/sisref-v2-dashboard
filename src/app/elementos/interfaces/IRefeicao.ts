import z from 'zod';


export const IRefeicaoSchema = z.object({
    refeicao: z.object({
        id: z.number().optional(),
        description: z.string(),
        qtdTimeReservationEnd: z.number(),
        qtdTimeReservationStart: z.number(),
        timeEnd: z.string(),
        timeStart: z.string(),
    }).optional(),
    cardapio: z.object({
        agendado: z.boolean(),
        date: z.string(),
        description: z.string(),
        permission: z.preprocess((value) => Boolean(value), z.boolean()),
        id: z.number(),
        campus_id: z.number(),
        canceled_by_student: z.boolean().optional(),
    }).optional(),
});

export type IRefeicao = z.infer<typeof IRefeicaoSchema>
export type IRefeicaoComTurno = IRefeicao & { turno: 1 | 2 | 3 | 4 }
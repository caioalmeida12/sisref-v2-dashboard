import z from 'zod';

const TurnoSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);

export const TRefeicaoSchema = z.object({
    id: z.number(),
    description: z.string(),
    qtdTimeReservationEnd: z.number(),
    qtdTimeReservationStart: z.number(),
    timeEnd: z.string(),
    timeStart: z.string(),
});

export const TRefeicaoComTurnoSchema = TRefeicaoSchema.extend({
    turno: TurnoSchema
});


export const TCardapioSchema = z.object({
    agendado: z.boolean(),
    date: z.string(),
    description: z.string(),
    permission: z.boolean(),
    id: z.number(),
    campus_id: z.number(),
    canceled_by_student: z.boolean().optional(),
    absenceJustification: z.string().nullable().optional()
});

export const TRefeicaoECardapioSchema = z.object({
    meal: TRefeicaoSchema,
    menu: TCardapioSchema
});

export type TRefeicao = z.infer<typeof TRefeicaoSchema>
export type TCardapio = z.infer<typeof TCardapioSchema>
export type TRefeicaoECardapio = z.infer<typeof TRefeicaoECardapioSchema>
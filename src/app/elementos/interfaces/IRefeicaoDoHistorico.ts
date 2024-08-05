import z from 'zod';

const IRefeicaoDoHistoricoSchema = z.object({
    id: z.number(),
    ticket_id: z.number().optional(),
    turno: z.preprocess((num) => String(num), z.enum(["1", "2", "3", "4"]).optional()),
    cardapio: z.object({
        id: z.number(),
        date: z.string(),
        description: z.string(),
        campus_id: z.number(),
        meal_id: z.number(),
    }),
    refeicao: z.object({
        id: z.number(),
        description: z.string(),
        timeEnd: z.string(),
        timeStart: z.string(),
        campus_id: z.number(),
        qtdTimeReservationEnd: z.number(),
        qtdTimeReservationStart: z.number(),
    }),
    status: z.string().optional(),
    absenceJustification: z.string().nullable(),
    studentJustification: z.string().nullable(),
});

export const ParseRefeicaoDoHistorico = (refeicao: any) => {
    return typeof refeicao === "object" ? IRefeicaoDoHistoricoSchema.safeParse({
        ...refeicao,
        ticket_id: refeicao.id,
        turno: refeicao.meal_id,
        cardapio: refeicao.menu,
        refeicao: refeicao.meal,
    }) : { success: false, data: null }
}

export const IRefeicaoDoHistorico = IRefeicaoDoHistoricoSchema;

export type IRefeicaoDoHistorico = z.infer<typeof IRefeicaoDoHistoricoSchema>;
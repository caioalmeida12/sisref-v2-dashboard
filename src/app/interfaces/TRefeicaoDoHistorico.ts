import z from 'zod';
import { TCardapioSchema, TRefeicaoSchema } from './TRefeicao';

export const TRefeicaoDoHistoricoSchema = z.object({
    status: z.string().optional(),
    id: z.number(),
    date: z.string(),
    dateInsert: z.string(),
    time: z.string(),
    wasPresent: z.number(),
    meal_id: z.number(),
    student_id: z.number(),
    user_id: z.number().nullable(),
    campus_id: z.number(),
    absenceJustification: z.string().nullable(),
    canceled_by_student: z.number(),
    ticketCode: z.string().nullable(),
    menu_id: z.number(),
    studentJustification: z.string().nullable(),
    menu: TCardapioSchema.pick({ id: true, date: true, description: true, campus_id: true }),
    meal: TRefeicaoSchema.pick({ id: true, description: true, timeEnd: true, timeStart: true, qtdTimeReservationEnd: true, qtdTimeReservationStart: true }),
});

export type TRefeicaoDoHistorico = z.infer<typeof TRefeicaoDoHistoricoSchema>
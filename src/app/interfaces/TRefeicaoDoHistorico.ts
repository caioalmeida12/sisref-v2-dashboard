import z from 'zod';
import { TCardapioSchema, TRefeicaoSchema, TTurnoSchema } from './TRefeicao';

// id: 460284,
//     date: '2024-04-09',
//     dateInsert: '2024-04-09',
//     time: '11:41:42',
//     wasPresent: 1,
//     meal_id: 2,
//     student_id: 2153,
//     user_id: 5365,
//     campus_id: 1,
//     absenceJustification: null,
//     canceled_by_student: 0,
//     ticketCode: null,
//     menu_id: 2420,
//     studentJustification: null,
//     menu: {
//       id: 2420,
//       date: '2024-04-09',
//       description: 'Paçoca de carne sol; Arroz parboilizado; Feijão carioca com batata doce; Purê de batata; Salada de repolho, cenoura e Azeitona; Melancia',
//       campus_id: 1,
//       meal_id: 2
//     },
//     meal: {
//       id: 2,
//       description: 'Almoço',
//       timeEnd: '13:10:00',
//       timeStart: '10:58:00',
//       campus_id: 1,
//       qtdTimeReservationEnd: 1,
//       qtdTimeReservationStart: 11
//     }


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
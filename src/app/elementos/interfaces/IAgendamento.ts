import { z } from "zod";
import { IInformacoesDeEstudanteSchema } from "./IInformacoesDeEstudante";

export const IAgendamentoSchema = z.object({
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
    student: IInformacoesDeEstudanteSchema,
    menu: z.object({
        id: z.number(),
        date: z.string(),
        description: z.string(),
        campus_id: z.number(),
        meal_id: z.number(),
    }),
    meal: z.object({
        id: z.number(),
        description: z.string(),
        timeEnd: z.string(),
        timeStart: z.string(),
        campus_id: z.number(),
        qtdTimeReservationEnd: z.number(),
        qtdTimeReservationStart: z.number(),
    }),
});

export type IAgendamento = z.infer<typeof IAgendamentoSchema>;
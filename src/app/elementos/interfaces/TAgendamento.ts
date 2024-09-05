import { z } from "zod";
import { TEstudanteComCursoSchema, TEstudanteSchema } from "./TEstudante";
import { TCardapioSchema, TRefeicaoSchema } from "./TRefeicao";
import { TCampusSchema } from "./TCampus";

export const TAgendamentoSchema = z.object({
    id: z.number(),
    date: z.string(),
    dateInsert: z.string(),
    time: z.string(),
    wasPresent: z.number(),
    meal_id: TRefeicaoSchema.pick({ id: true }),
    student_id: TEstudanteSchema.pick({ id: true }),
    user_id: z.number().nullable(),
    campus_id: TCampusSchema.pick({ id: true }),
    absenceJustification: z.string().nullable(),
    canceled_by_student: z.number(),
    ticketCode: z.string().nullable(),
    menu_id: TCardapioSchema.pick({ id: true }),
    studentJustification: z.string().nullable(),
    student: TEstudanteComCursoSchema,
    menu: TCardapioSchema.omit({ agendado: true, permission: true }),
    meal: TRefeicaoSchema,
});

export type TAgendamento = z.infer<typeof TAgendamentoSchema>;
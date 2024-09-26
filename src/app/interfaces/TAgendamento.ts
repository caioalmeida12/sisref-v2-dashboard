import { z } from "zod";
import { TEstudanteComCursoSchema } from "./TEstudante";
import { TCardapioSchema, TRefeicaoSchema } from "./TRefeicao";

export const TAgendamentoSchema = z.object({
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
  student: TEstudanteComCursoSchema,
  menu: TCardapioSchema.omit({ agendado: true, permission: true }),
  meal: TRefeicaoSchema,
});

export type TAgendamento = z.infer<typeof TAgendamentoSchema>;

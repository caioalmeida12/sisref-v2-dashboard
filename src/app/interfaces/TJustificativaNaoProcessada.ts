import z from "zod";
import { TCardapioSchema, TRefeicaoSchema } from "./TRefeicao";
import { TEstudanteSchema } from "./TEstudante";

export const TJustificativaNaoProcessada = z.object({
  absenceJustification: z.null(),
  campus_id: z.number(),
  canceled_by_student: z.number(),
  date: z.string(),
  dateInsert: z.string(),
  id: z.number(),
  meal: TRefeicaoSchema,
  meal_id: z.number(),
  menu: TCardapioSchema.omit({ agendado: true, permission: true }),
  menu_id: z.number(),
  student: TEstudanteSchema,
  studentJustification: z.string(),
  student_id: z.number(),
  ticketCode: z.null(),
  time: z.string(),
  user_id: z.null(),
  wasPresent: z.number(),
});

export type TJustificativaNaoProcessada = z.infer<
  typeof TJustificativaNaoProcessada
>;

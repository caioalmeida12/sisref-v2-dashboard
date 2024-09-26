import { z } from "zod";

export const TRelatorioDeRefeicoesSchema = z.object({
  absenceJustification: z.string().nullable(),
  active: z.number(),
  block: z.string().nullable(),
  campus_id: z.number(),
  canceled_by_student: z.number(),
  course_id: z.number(),
  date: z.string(),
  dateInsert: z.string(),
  dateValid: z.string(),
  description: z.string(),
  id: z.number(),
  initials: z.string(),
  mat: z.string(),
  meal_description: z.string(),
  meal_id: z.number(),
  menu_id: z.number(),
  name: z.string(),
  observation: z.string().nullable(),
  photo: z.string().nullable(),
  republic: z.string().nullable(),
  semRegular: z.number(),
  shift_id: z.number(),
  studentJustification: z.string().nullable(),
  student_id: z.number(),
  ticketCode: z.string().nullable(),
  time: z.string(),
  user_id: z.string().nullable(),
  wasPresent: z.number(),
});

export type TRelatorioDeRefeicoes = z.infer<typeof TRelatorioDeRefeicoesSchema>;

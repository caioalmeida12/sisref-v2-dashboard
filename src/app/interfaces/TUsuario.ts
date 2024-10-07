// Este arquivo é refente à tabela user do banco de dados. Não é referente à tabela students.

import z from "zod";

export const TUsuarioSchema = z.object({
  id: z.number(),
  active: z.number(),
  login: z.string(),
  name: z.string(),
  senha: z.string().nullable(),
  tipo: z.string().nullable(),
  campus_id: z.number().nullable(),
  password: z.string().optional(),
  type: z.string(),
  email: z.string().nullable(),
  student_id: z.number().nullable(),
});

export type TUsuario = z.infer<typeof TUsuarioSchema>;

import { z } from "zod"
import { TEstudanteSchema } from "./TEstudante"

export const TBuscarRefeicoesAutorizadasSchema = z.object({
    id: z.number(),
    friday: z.number(),
    monday: z.number(),
    saturday: z.number(),
    thursday: z.number(),
    tuesday: z.number(),
    wednesday: z.number(),
    meal_id: z.number(),
    student_id: z.number(),
    comentario: z.string().nullable(),
    meal: z.object({
        id: z.number(),
        description: z.string(),
        timeEnd: z.string(),
        timeStart: z.string(),
        campus_id: z.number(),
        qtdTimeReservationEnd: z.number(),
        qtdTimeReservationStart: z.number(),
    }),
    student: TEstudanteSchema,
})

export type TBuscarRefeicoesAutorizadas = z.infer<typeof TBuscarRefeicoesAutorizadasSchema>
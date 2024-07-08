import { IInformacoesDeEstudante } from "./IInformacoesDeEstudante"

export interface IFetchRefeicoesAutorizadas {
    id: number
    friday: number
    monday: number
    saturday: number
    thursday: number
    tuesday: number
    wednesday: number
    meal_id: number
    student_id: number
    comentario: string
    meal: {
        id: number
        description: string
        timeEnd: string
        timeStart: string
        campus_id: number
        qtdTimeReservationEnd: number
        qtdTimeReservationStart: number
    }
    student: IInformacoesDeEstudante
}
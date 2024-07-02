export type IRefeicao = {
    turno: 1 | 2 | 3 | 4;
    refeicao?: {
        id?: number;
        description: string;
        qtdTimeReservationEnd: number;
        qtdTimeReservationStart: number;
        timeEnd: string;
        timeStart: string;
    }
    cardapio?: {
        agendado: boolean;
        date: string;
        description: string;
        permission: boolean;
        id: number;
        campus_id: number;
        canceled_by_student?: boolean;
    }
}
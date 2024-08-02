export interface IRefeicaoDoHistorico {
    ticket_id: number;
    turno: 1 | 2 | 3 | 4;
    cardapio: {
        id: number;
        date: string;
        description: string;
        campus_id: number;
        meal_id: number;
    };
    refeicao: {
        id: number;
        description: string;
        timeEnd: string;
        timeStart: string;
        campus_id: number;
        qtdTimeReservationEnd: number;
        qtdTimeReservationStart: number;
    };
    status: "a-ser-utilizado" | "utilizado" | "cancelado" | "nao-utilizado" | "justificado" | "nao-utilizado-sem-justificativa";
    absenceJustification: string | null
}
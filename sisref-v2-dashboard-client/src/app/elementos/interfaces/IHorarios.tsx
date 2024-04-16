export interface IHorarios {
    qtdTimeReservationEnd: number;
    qtdTimeReservationStart: number;
    timeEnd: string;
    timeStart: string;
}

export type IApenasHorario = {
    variante: "horario",
    horarios: IHorarios
}

export type IApenasData = {
    variante: "data",
    data: string,
}

export type IHorarioEData = {
    variante: "horario-e-data",
    horarios: IHorarios,
    data: string,
}
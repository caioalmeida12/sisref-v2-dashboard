interface Horarios {
    qtdTimeReservationEnd: number;
    qtdTimeReservationStart: number;
    timeEnd: string;
    timeStart: string;

}

type ApenasHorario = {
    variante: "horario",
    horarios: Horarios
}

type ApenasData = {
    variante: "data",
    data: string,
}

type HorarioEData = {
    variante: "horario-e-data",
    horarios: Horarios,
    data: string,
}

type HorarioDaRefeicaoProps =
    | ApenasHorario
    | ApenasData
    | HorarioEData;

const textoPorVariante = (props: HorarioDaRefeicaoProps) => {
    switch (props.variante) {
        case "horario":
            return `${props.horarios.timeStart} -${props.horarios.timeEnd}`;
        case "data":
            return `${props.data}`;
        case "horario-e-data":
            return `${props.data} - ${props.horarios.timeStart} - ${props.horarios.timeEnd}`;
    }
}

export const HorarioDaRefeicao = (props: HorarioDaRefeicaoProps) => {
    return (
        <p className="text-cinza-600">
            {textoPorVariante(props)}
        </p>
    )
}
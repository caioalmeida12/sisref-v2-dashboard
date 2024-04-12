import { Botao } from "../basicos/Botao";
import { HorarioDaRefeicao } from "../basicos/HorarioDaRefeicao";
import { NomeDaRefeicao } from "../basicos/NomeDaRefeicao";
import { Secao } from "../basicos/Secao";
import { StatusDaRefeicao } from "../basicos/StatusDaRefeicao";

interface Refeicao {
    turno: 1 | 2 | 3 | 4;
    refeicao?: {
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

const varianteDoNomeDaRefeicaoPorTurno = {
    1: "manha",
    2: "almoco",
    3: "tarde",
    4: "noite"
} as const;

const descricaoDeCardapioParaArrayDeStrings = (descricao: string) => {
    return descricao.split(/[;+]/).map((texto) => texto)
}

const statusDaRefeicaoPorProps = (props: Refeicao) => {
    if (props.cardapio?.canceled_by_student) return <StatusDaRefeicao cor="vermelho-400" icone="tag-x" texto="Cancelado" />
    if (props.cardapio?.agendado) return <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Reservado" />

    // a refeição estará disponível caso o (timeStart - qtdTimeReservationStart * 60) seja menor ou igual à hora atual em formato 09:00:00
    // e o (timeEnd - qtdTimeReservationEnd * 60) seja maior ou igual à hora atual em formato 09:00:00
    // ex: timeStart = 19:50:00
    //     timeEnd = 20:40:00
    //     qtdTimeReservationStart = 1
    //     qtdTimeReservationEnd = 1
    //     horaAtual = 20:00:00
    //     horaAtualEmMinutos = 1200
    //     horaInicio = 19:50:00
    //     horaInicioEmMinutos = 1190
    //     horaFim = 20:40:00
    //     horaFimEmMinutos = 1240
    //     1190 - (1 * 60) <= 1200 && 1240 + (1 * 60) >= 1200
    //     true && true
    if (props.refeicao) {
        const horaAtual = new Date().toLocaleTimeString().split(":").map((numero) => parseInt(numero))
        const horaAtualEmMinutos = horaAtual[0] * 60 + horaAtual[1]

        const horaInicio = props.refeicao.timeStart.split(":").map((numero) => parseInt(numero))
        const horaInicioEmMinutos = horaInicio[0] * 60 + horaInicio[1] - props.refeicao.qtdTimeReservationStart * 60

        const horaFim = props.refeicao.timeEnd.split(":").map((numero) => parseInt(numero))
        const horaFimEmMinutos = horaFim[0] * 60 + horaFim[1] + props.refeicao.qtdTimeReservationEnd * 60

        if (horaInicioEmMinutos <= horaAtualEmMinutos && horaFimEmMinutos >= horaAtualEmMinutos) {
            return <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Disponível" />
        }
    }

    // a refeição estará encerrada caso o (timeEnd - qtdTimeReservationEnd * 60) seja menor que a hora atual em formato 09:00:00
    // ex: timeEnd = 20:40:00
    //     qtdTimeReservationEnd = 1
    //     horaAtual = 21:00:00
    //     horaAtualEmMinutos = 1260
    //     horaFim = 20:40:00
    //     horaFimEmMinutos = 1240
    //     1240 + (1 * 60) < 1260
    //     true
    if (props.refeicao) {
        const horaAtual = new Date().toLocaleTimeString().split(":").map((numero) => parseInt(numero))
        const horaAtualEmMinutos = horaAtual[0] * 60 + horaAtual[1]

        const horaFim = props.refeicao.timeEnd.split(":").map((numero) => parseInt(numero))
        const horaFimEmMinutos = horaFim[0] * 60 + horaFim[1] + props.refeicao.qtdTimeReservationEnd * 60

        if (horaFimEmMinutos < horaAtualEmMinutos) {
            return <StatusDaRefeicao cor="cinza-600" icone="circulo-x" texto="Encerrado" />
        }
    }

}

const RefeicaoCurta = (props: Refeicao) => {
    return (
        <Secao>
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteDoNomeDaRefeicaoPorTurno[props.turno]} />
                {statusDaRefeicaoPorProps(props)}
            </div>
        </Secao>
    )
}

const RefeicaoLongaSemBotao = (props: Refeicao) => {
    if (!props.refeicao) return <RefeicaoCurta turno={props.turno} />

    return (
        <Secao className="flex flex-col gap-y-2">
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteDoNomeDaRefeicaoPorTurno[props.turno]} />
                {statusDaRefeicaoPorProps(props)}
            </div>
            <HorarioDaRefeicao variante="horario" horarios={props.refeicao} />
            <p className="leading-6">
                {descricaoDeCardapioParaArrayDeStrings(props.refeicao.description).map((descricao) => (
                    <>
                        {descricao} <br />
                    </>
                ))}
            </p>
        </Secao>
    )
}

const RefeicaoLongaComBotao = (props: Refeicao) => {
    if (!props.refeicao) return <RefeicaoCurta turno={props.turno} />

    return (
        <Secao className="flex flex-col gap-y-2">
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteDoNomeDaRefeicaoPorTurno[props.turno]} />
                {statusDaRefeicaoPorProps(props)}
            </div>
            <HorarioDaRefeicao variante="horario" horarios={props.refeicao} />
            <p className="leading-6">
                {descricaoDeCardapioParaArrayDeStrings(props.refeicao.description).map((descricao) => (
                    <>
                        {descricao} <br />
                    </>
                ))}
            </p>
            <Botao texto="Adicionar" variante="adicionar" />
        </Secao>
    )
}

export const Refeicao = (props: Refeicao) => {
    if (props.cardapio?.agendado) return <RefeicaoLongaComBotao {...props} />
    return <RefeicaoLongaSemBotao {...props} />
}
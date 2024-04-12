import React from "react";
import { Botao } from "../basicos/Botao";
import { HorarioDaRefeicao } from "../basicos/HorarioDaRefeicao";
import { NomeDaRefeicao } from "../basicos/NomeDaRefeicao";
import { Secao } from "../basicos/Secao";
import { StatusDaRefeicao } from "../basicos/StatusDaRefeicao";
import { IRefeicao } from "../interfaces/IRefeicao";

const varianteNomeRefeicaoPorTurno = {
    1: "manha",
    2: "almoco",
    3: "tarde",
    4: "noite"
} as const;

const elementoStatusRefeicaoPorTextoStatusRefeicao = {
    "disponivel": <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Disponível" />,
    "encerrado": <StatusDaRefeicao cor="cinza-600" icone="circulo-x" texto="Encerrado" />,
    "bloqueado": <StatusDaRefeicao cor="amarelo-200" icone="cadeado" texto="Bloqueado" />,
    "cancelado": <StatusDaRefeicao cor="vermelho-400" icone="tag-x" texto="Cancelado" />,
    "reservado": <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Reservado" />,
    "indisponivel": <StatusDaRefeicao cor="cinza-600" icone="relogio-x" texto="Indisponível" />
} as const;

/**
 * Converte a descrição do cardápio em um array de strings.
 * @param descricao - A descrição do cardápio.
 * @returns O array de strings.
 */
const descricaoCardapioParaArrayStrings = (descricao: string) => {
    return descricao.split(/[;+]/)
}

/**
 * Retorna a hora atual em minutos.
 * @returns A hora atual em minutos.
 */
const getHoraAtualEmMinutos = () => {
    const horaAtual = new Date().toLocaleTimeString().split(":").map((numero) => Number(numero));
    return horaAtual[0] * 60 + horaAtual[1];
}

/**
 * Converte uma string de tempo fornecida em minutos, considerando um ajuste de reserva de tempo.
 * @param hora - A string de tempo no formato "HH:mm".
 * @param qtdTimeReservation - A quantidade de reserva de tempo em horas (qtdTimeReservationStart ou qtdTimeReservationEnd).
 * @param isQtdTimeReservationStart - Indica se o tempo fornecido é um horário de início ou de término.
 * @returns O tempo convertido em minutos.
 * @example getHoraEmMinutos("12:00", 1, true) // 660
 * @example getHoraEmMinutos("12:00", 1, false) // 780
 */
const getHoraEmMinutos = (hora: string, qtdTimeReservation: number, isQtdTimeReservationStart: boolean) => {
    const horaArray = hora.split(":").map((numero) => Number(numero));
    const ajuste = isQtdTimeReservationStart ? -qtdTimeReservation : qtdTimeReservation;
    return horaArray[0] * 60 + horaArray[1] + ajuste * 60;
}

/**
 * Retorna o status da refeição com base nas props fornecidas.
 * @param props - As props da refeição.
 * @returns O status da refeição em string.
 */
const textoStatusRefeicaoPorProps = (props: IRefeicao): keyof typeof elementoStatusRefeicaoPorTextoStatusRefeicao => {
    if (!(props.cardapio) || !(props.refeicao)) return "encerrado";
    if (!(props.cardapio.permission)) return "bloqueado";
    if (props.cardapio.canceled_by_student) return "cancelado";
    if (props.cardapio.agendado) return "reservado";

    const horaAtualEmMinutos = getHoraAtualEmMinutos();
    const horaInicioEmMinutos = getHoraEmMinutos(props.refeicao.timeStart, props.refeicao.qtdTimeReservationStart, true);
    const horaFimEmMinutos = getHoraEmMinutos(props.refeicao.timeEnd, props.refeicao.qtdTimeReservationEnd, false);

    if (horaInicioEmMinutos > horaAtualEmMinutos || horaFimEmMinutos < horaAtualEmMinutos) {
        return "indisponivel";
    }

    if (horaInicioEmMinutos <= horaAtualEmMinutos && horaAtualEmMinutos <= horaFimEmMinutos) {
        return "disponivel";
    }

    return "encerrado";
}

const RefeicaoCurta = (props: IRefeicao) => {
    const StatusRefeicao = elementoStatusRefeicaoPorTextoStatusRefeicao[textoStatusRefeicaoPorProps(props)];

    return (
        <Secao>
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteNomeRefeicaoPorTurno[props.turno]} />
                {StatusRefeicao}
            </div>
        </Secao>
    )
}

const RefeicaoLonga = (props: IRefeicao, comBotao: boolean) => {
    if (!props.refeicao || !props.cardapio) return <RefeicaoCurta turno={props.turno} />

    const StatusRefeicao = elementoStatusRefeicaoPorTextoStatusRefeicao[textoStatusRefeicaoPorProps(props)];
    const textoStatus = textoStatusRefeicaoPorProps(props);

    return (
        <Secao className="flex flex-col gap-y-2">
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteNomeRefeicaoPorTurno[props.turno]} />
                {StatusRefeicao}
            </div>
            <HorarioDaRefeicao variante="horario" horarios={props.refeicao} />
            <p className="leading-6">
                {descricaoCardapioParaArrayStrings(props.cardapio.description).map((descricao, index) => (
                    <React.Fragment key={index}>
                        <span>
                            {descricao}
                        </span>
                        <br />
                    </React.Fragment>
                ))}
            </p>
            {comBotao && textoStatus === "disponivel" && <Botao variante="adicionar" texto="Reservar" />}
            {comBotao && textoStatus === "reservado" && <Botao variante="remover" texto="Cancelar" />}
        </Secao>
    )
}

export const Refeicao = (props: IRefeicao) => {
    const textoStatus = textoStatusRefeicaoPorProps(props);
    const comBotao = textoStatus === "disponivel" || textoStatus === "reservado";
    return RefeicaoLonga(props, comBotao);
}
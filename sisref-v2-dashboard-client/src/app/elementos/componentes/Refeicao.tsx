import React from "react";
import { Botao } from "@elementos/basicos/Botao";
import { HorarioDaRefeicao } from "@elementos/basicos/HorarioDaRefeicao";
import { NomeDaRefeicao } from "@elementos/basicos/NomeDaRefeicao";
import { Secao } from "@elementos/basicos/Secao";
import { StatusDaRefeicao } from "@elementos/basicos/StatusDaRefeicao";
import { IRefeicao } from "../interfaces/IRefeicao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";

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
    return descricao.split(/[;+]/).filter(naoVazio => naoVazio)
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

    const dataHoraDaRefeicao = DatasHelper.compilarDataHora(props.cardapio.date, props.refeicao.timeStart);
    const diferencaEmHoras = DatasHelper.getDiferencaEmHoras(dataHoraDaRefeicao);

    if (diferencaEmHoras < 0) return "encerrado";
    if (diferencaEmHoras > props.refeicao?.qtdTimeReservationStart) return "indisponivel";
    if (diferencaEmHoras < props.refeicao?.qtdTimeReservationEnd) return "indisponivel";

    return "disponivel";
}

const RefeicaoCurta = (props: IRefeicao) => {
    const StatusRefeicao = elementoStatusRefeicaoPorTextoStatusRefeicao[textoStatusRefeicaoPorProps(props)];

    return (
        <Secao className="bg-white text-black dark:bg-preto-100 dark:text-cinza-400">
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
        <Secao className="flex flex-col gap-y-2 bg-white text-black ">
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteNomeRefeicaoPorTurno[props.turno]} />
                <HorarioDaRefeicao
                    variante="horario-e-data"
                    data={DatasHelper.converterParaFormatoBrasileiro(props.cardapio.date)}
                    horarios={{
                        qtdTimeReservationEnd: props.refeicao.qtdTimeReservationEnd,
                        qtdTimeReservationStart: props.refeicao.qtdTimeReservationStart,
                        timeEnd: DatasHelper.removerSegundosDoHorario(props.refeicao.timeEnd),
                        timeStart: DatasHelper.removerSegundosDoHorario(props.refeicao.timeStart)
                    }}
                />
                {StatusRefeicao}
            </div>
            <HorarioDaRefeicao
                variante="horario-e-data"
                data={DatasHelper.converterParaFormatoBrasileiro(props.cardapio.date)}
                horarios={{
                    qtdTimeReservationEnd: props.refeicao.qtdTimeReservationEnd,
                    qtdTimeReservationStart: props.refeicao.qtdTimeReservationStart,
                    timeEnd: DatasHelper.removerSegundosDoHorario(props.refeicao.timeEnd),
                    timeStart: DatasHelper.removerSegundosDoHorario(props.refeicao.timeStart)
                }}
            />
            <p className="leading-6 dark:text-cinza-400">
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
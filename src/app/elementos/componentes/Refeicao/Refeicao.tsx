import React from "react";
import { HorarioDaRefeicao } from "@elementos/basicos/HorarioDaRefeicao";
import { NomeDaRefeicao } from "@elementos/basicos/NomeDaRefeicao";
import { Secao } from "@elementos/basicos/Secao";
import { StatusDaRefeicao } from "@elementos/basicos/StatusDaRefeicao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { pegarStatusDaRefeicao } from "@/app/lib/elementos/Refeicao";
import { IRefeicaoComTurno } from "@elementos/interfaces/IRefeicao";
import Skeleton from "react-loading-skeleton";
import { BotaoDeRefeicao } from "./BotaoDeRefeicao";

const varianteNomeRefeicaoPorTurno = {
    1: "manha",
    2: "almoco",
    3: "tarde",
    4: "noite"
} as const;

const elementoStatusRefeicaoPorTextoStatusRefeicao = {
    "disponivel": <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Disponível" textoTooltip="Você pode reservar esta refeição." />,
    "encerrado": <StatusDaRefeicao cor="cinza-600" icone="circulo-x" texto="Encerrado" textoTooltip="O horário de reservas já foi ultrapassado." />,
    "bloqueado": <StatusDaRefeicao cor="amarelo-200" icone="cadeado" texto="Bloqueado" textoTooltip="Esta refeição não está liberada para você." />,
    "cancelado": <StatusDaRefeicao cor="vermelho-400" icone="tag-x" texto="Cancelado" textoTooltip="Você cancelou esta refeição." />,
    "reservado": <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Reservado" textoTooltip="Você reservou esta refeição." />,
    "indisponivel": <StatusDaRefeicao cor="cinza-600" icone="relogio-x" texto="Indisponível" textoTooltip="Está muito cedo ou muito tarde para reservar esta refeição." />
} as const;

/**
 * Converte a descrição do cardápio em um array de strings.
 * @param descricao - A descrição do cardápio.
 * @returns O array de strings.
 */
const descricaoCardapioParaArrayStrings = (descricao: string) => {
    return descricao.split(/[;+]/).filter(naoVazio => naoVazio)
}

const RefeicaoCurta = (props: IRefeicaoComTurno) => {
    const StatusRefeicao = elementoStatusRefeicaoPorTextoStatusRefeicao[pegarStatusDaRefeicao(props)];

    return (
        <Secao className="h-fit">
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteNomeRefeicaoPorTurno[props.turno]} />
                {StatusRefeicao}
            </div>
        </Secao>
    )
}

const RefeicaoLonga = (props: IRefeicaoComTurno, comBotao: boolean) => {
    if (!props.refeicao || !props.cardapio) return <RefeicaoCurta turno={props.turno} />

    const StatusRefeicao = elementoStatusRefeicaoPorTextoStatusRefeicao[pegarStatusDaRefeicao(props)];
    const textoStatus = pegarStatusDaRefeicao(props);

    return (
        <Secao className="flex flex-col gap-y-2 h-fit">
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteNomeRefeicaoPorTurno[props.turno]} />
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
            {comBotao && textoStatus === "disponivel" && <BotaoDeRefeicao.Reservar meal_id={props.refeicao.id} date={props.cardapio.date} />}
            {comBotao && textoStatus === "reservado" && <BotaoDeRefeicao.BotaoDeAbrir meal_id={props.refeicao.id} date={props.cardapio.date} />}
        </Secao>
    )
}

export const Refeicao = (props: IRefeicaoComTurno) => {
    const textoStatus = pegarStatusDaRefeicao(props);
    const comBotao = textoStatus === "disponivel" || textoStatus === "reservado";
    return RefeicaoLonga(props, comBotao);
}

export const RefeicaoLoading = () => {
    return (
        <Secao className="flex flex-col gap-y-2 h-fit">
            <div className="flex justify-between">
                <Skeleton width={140} height={20} />
                <Skeleton width={80} height={20} />
            </div>
            <Skeleton width={"70%"} height={20} />
            <p className="leading-6">
                <Skeleton width={"60%"} height={20} />
                <Skeleton width={"70%"} height={20} />
                <Skeleton width={"50%"} height={20} />
                <Skeleton width={"45%"} height={20} />
            </p>
            <Skeleton width={"100%"} height={58} />
        </Secao>
    )
}
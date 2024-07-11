import React from "react";
import { Botao } from "@elementos/basicos/Botao";
import { HorarioDaRefeicao } from "@elementos/basicos/HorarioDaRefeicao";
import { NomeDaRefeicao } from "@elementos/basicos/NomeDaRefeicao";
import { Secao } from "@elementos/basicos/Secao";
import { StatusDaRefeicao } from "@elementos/basicos/StatusDaRefeicao";
import { IRefeicao } from "../interfaces/IRefeicao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { pegarStatusDaRefeicao } from "@/app/lib/elementos/Refeicao";

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

const RefeicaoCurta = (props: IRefeicao) => {
    const StatusRefeicao = elementoStatusRefeicaoPorTextoStatusRefeicao[pegarStatusDaRefeicao(props)];

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

    const StatusRefeicao = elementoStatusRefeicaoPorTextoStatusRefeicao[pegarStatusDaRefeicao(props)];
    const textoStatus = pegarStatusDaRefeicao(props);

    return (
        <Secao className="flex flex-col gap-y-2">
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
                {comBotao && textoStatus === "disponivel" && <Botao variante="adicionar" texto="Reservar" className="mt-auto"/>}
                {comBotao && textoStatus === "reservado" && <Botao variante="remover" texto="Cancelar" className="mt-auto"/>}
        </Secao>
    )
}

export const Refeicao = (props: IRefeicao) => {
    const textoStatus = pegarStatusDaRefeicao(props);
    const comBotao = textoStatus === "disponivel" || textoStatus === "reservado";
    return RefeicaoLonga(props, comBotao);
}
import React from "react";
import { HorarioDaRefeicao } from "@elementos/basicos/HorarioDaRefeicao";
import { NomeDaRefeicao } from "@elementos/basicos/NomeDaRefeicao";
import { Secao } from "@elementos/basicos/Secao";
import { StatusDaRefeicao } from "@elementos/basicos/StatusDaRefeicao";
import { IRefeicaoDoHistorico } from "../interfaces/IRefeicaoDoDoHistorico";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import Skeleton from "react-loading-skeleton";


const varianteNomeRefeicaoPorTurno = {
    1: "manha",
    2: "almoco",
    3: "tarde",
    4: "noite"
} as const;

const elementoStatusRefeicaoPorTextoStatusRefeicao = {
    "a-ser-utilizado": <StatusDaRefeicao cor="azul-400" icone="circulo-check" texto="A ser utilizado" />,
    "nao-utilizado": <StatusDaRefeicao cor="amarelo-200" icone="circulo-x" texto="Não utilizado" />,
    "justificado": <StatusDaRefeicao cor="azul-400" icone="circulo-check" texto="Justificado" />,
    "cancelado": <StatusDaRefeicao cor="vermelho-400" icone="tag-x" texto="Cancelado" />,
    "utilizado": <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Utilizado" />,
} as const;

/**
 * Converte a descrição do cardápio em um array de strings.
 * @param descricao - A descrição do cardápio.
 * @returns O array de strings.
 */
const descricaoCardapioParaArrayStrings = (descricao: string) => {
    return descricao.split(/[;+]/).filter(naoVazio => naoVazio)
}

export const RefeicaoDoHistorico = (props: IRefeicaoDoHistorico) => {
    return (
        <Secao className="flex flex-col gap-4">
            <div className="flex justify-between gap-x-2">
                <NomeDaRefeicao variante={varianteNomeRefeicaoPorTurno[props.turno]} />
                {elementoStatusRefeicaoPorTextoStatusRefeicao[props.status]}
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
        </Secao>
    )
}

export const RefeicaoDoHistoricoLoading = () => {
    return (
        <Secao className="flex flex-col gap-4">
            <div className="flex justify-between gap-x-2">
                <Skeleton containerClassName="w-[60%]" />
                <Skeleton containerClassName="w-[40%]" />
            </div>
            <div className="flex justify-between gap-x-2">
                <Skeleton containerClassName="w-[50%]" />
                <Skeleton containerClassName="w-[50%]" />
            </div>
            <p className="leading-6">
                <Skeleton width={"80%"} />
                <Skeleton width={"60%"} />
                <Skeleton width={"70%"} />
                <Skeleton width={"40%"} />
            </p>
        </Secao>
    )
}
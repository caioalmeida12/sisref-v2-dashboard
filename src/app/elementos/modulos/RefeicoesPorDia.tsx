"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { Refeicao } from "../componentes/Refeicao/Refeicao";
import { Slider } from "../componentes/Slider";
import { fetchRefeicoesPorDia } from "@/app/actions/fetchRefeicoesPorDia";
import { IRefeicao } from "../interfaces/IRefeicao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { IconeInformacao } from "../basicos/icones/IconeInformacao";
import { Secao } from "../basicos/Secao";
import RefeicoesContext, { useRefeicoes } from "@/app/lib/elementos/RefeicoesContext";

const cache: { [data: string]: IRefeicao[] | undefined } = {};

export const RefeicoesPorDia = ({ forcarExibicao = false }: { forcarExibicao?: boolean }) => {
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [refetchRefeicoes, setRefetchRefeicoes] = useState(false);
    const { refeicoes, setRefeicoes, recarregar } = useRefeicoes();

    // Limitar a distância de dias entre a data atual e a data selecionada
    const dataSelecionada = new Date(data).toISOString().split('T')[0];
    const diferencaDias = DatasHelper.getDiferenciaEmDias(dataSelecionada);

    useEffect(() => {
        cache[data] = undefined;
    }, [recarregar]);

    useEffect(() => {
        if (cache[data]) return

        fetchRefeicoesPorDia({ data })
            .then((refeicoes) => {
                refeicoes && setRefeicoes(refeicoes);

                cache[data] = refeicoes;
            })
            .catch((erro) => console.error(erro));
    }, [data, refetchRefeicoes, recarregar]);

    const elementosRefeicao = ([1, 2, 3, 4] as const).map((turno) => (
        <Refeicao key={turno} turno={turno} refeicao={
            refeicoes.find((refeicao) => refeicao.refeicao?.id === turno)?.refeicao
        } cardapio={
            refeicoes.find((refeicao) => refeicao.refeicao?.id === turno)?.cardapio
        } />
    ));

    const textoData = new Date().toISOString().split('T')[0] === data ? "hoje" : DatasHelper.converterParaFormatoBrasileiro(data);

    return (
        <Secao className={`${forcarExibicao ? "flex" : "hidden"} flex-col gap-y-4 lg:grid lg:grid-cols-2 lg:gap-4`}>
            <Slider texto={`Refeições para ${textoData}`} className="bg-preto-400 col-span-2"
                onNext={() => {
                    if (diferencaDias > 7) return;

                    const amanha = DatasHelper.getDataPosterior(data);
                    setData(amanha);
                }}

                onPrevious={() => {
                    if (diferencaDias < -7) return;

                    const ontem = DatasHelper.getDataAnterior(data);
                    setData(ontem);
                }}

                tooltip={
                    (refeicoes.length) ? null : (
                        <IconeInformacao texto="Nenhuma refeição encontrada para esta data" />
                    )
                }
            />
            {elementosRefeicao}
        </Secao>
    )
}
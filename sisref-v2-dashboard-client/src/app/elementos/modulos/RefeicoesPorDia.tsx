"use client"

import React from "react";

import { Refeicao } from "../componentes/Refeicao";
import { Secao } from "../basicos/Secao";
import { Slider } from "../componentes/Slider";
import { useEffect, useState } from "react";
import { fetchRefeicoesPorDia } from "@/app/actions/fetchRefeicoesPorDia";
import { IRefeicao } from "../interfaces/IRefeicao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { IconeInformacao } from "../basicos/icones/IconeInformacao";

const cache: { [data: string]: IRefeicao[] } = {};

export const RefeicoesPorDia = () => {
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [refeicoes, setRefeicoes] = useState<IRefeicao[]>([]);

    // Limitar a distância de dias entre a data atual e a data selecionada
    const dataSelecionada = new Date(data).toISOString().split('T')[0];
    const diferencaDias = DatasHelper.getDiferenciaEmDias(dataSelecionada);

    useEffect(() => {
        if (cache[data]) return setRefeicoes(cache[data]);

        fetchRefeicoesPorDia({ data })
            .then((refeicoes) => {
                refeicoes && setRefeicoes(refeicoes);

                cache[data] = refeicoes;
            })
            .catch((erro) => console.error(erro));
    }, [data])

    const elementosRefeicao = ([1, 2, 3, 4] as const).map((turno) => (
        <Refeicao key={turno} turno={turno} refeicao={
            refeicoes.find((refeicao) => refeicao.turno === turno)?.refeicao
        } cardapio={
            refeicoes.find((refeicao) => refeicao.turno === turno)?.cardapio
        } />
    ));

    const textoData = new Date().toISOString().split('T')[0] === data ? "hoje" : DatasHelper.converterParaFormatoBrasileiro(data);

    return (
        <Secao className="flex flex-col gap-y-4 md:grid md:grid-cols-2 md:gap-4 bg-branco-400 text-preto-400 dark:bg-darkMode-plano dark:text-darkMode-textoPrimario">
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
"use client"

import React, { useState } from "react";
import { Refeicao, RefeicaoLoading } from "../componentes/Refeicao/Refeicao";
import { Slider } from "../componentes/Slider";
import { fetchRefeicoesPorDia } from "@/app/actions/fetchRefeicoesPorDia";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { IconeInformacao } from "../basicos/icones/IconeInformacao";
import { Secao } from "../basicos/Secao";
import { useQuery } from "@tanstack/react-query";
import { IRefeicao } from "../interfaces/IRefeicao";


export const RefeicoesPorDia = ({ forcarExibicao = false }: { forcarExibicao?: boolean }) => {
    const [dataDaPesquisa, setDataDaPesquisa] = useState(new Date().toISOString().split('T')[0]);
    const textoData = new Date().toISOString().split('T')[0] === dataDaPesquisa ? "hoje" : DatasHelper.converterParaFormatoBrasileiro(dataDaPesquisa);

    const { data: refeicoes, isLoading, isError } = useQuery({
        queryKey: ['refeicoesPorDia', dataDaPesquisa],
        queryFn: () => fetchRefeicoesPorDia({ data: dataDaPesquisa })
    });

    // Limitar a distância de dias entre a data atual e a data selecionada
    const dataSelecionada = new Date(dataDaPesquisa).toISOString().split('T')[0];
    const diferencaDias = DatasHelper.getDiferenciaEmDias(dataSelecionada);

    return (
        <Secao className={`${forcarExibicao ? "flex" : "hidden"} flex-col gap-y-4 lg:grid lg:grid-cols-2 lg:gap-4`}>
            <Slider texto={`Refeições para ${textoData}`} className="bg-preto-400 col-span-2"
                onNext={() => {
                    if (diferencaDias > 7) return;

                    const amanha = DatasHelper.getDataPosterior(dataDaPesquisa);
                    setDataDaPesquisa(amanha);
                }}

                onPrevious={() => {
                    if (diferencaDias < -7) return;

                    const ontem = DatasHelper.getDataAnterior(dataDaPesquisa);
                    setDataDaPesquisa(ontem);
                }}

                tooltip={
                    (refeicoes?.length) ? null : (
                        <IconeInformacao texto="Nenhuma refeição encontrada para esta data" />
                    )
                }
            />
            {
                isLoading &&
                ([1, 2, 3, 4] as const).map((_, index) => (
                    <RefeicaoLoading key={index} />
                ))
            }
            {
                refeicoes &&
                ([1, 2, 3, 4] as const).map((turno) => (
                    <Refeicao key={turno} turno={turno} refeicao={
                        refeicoes.find((refeicao: IRefeicao) => refeicao.refeicao?.id === turno)?.refeicao
                    } cardapio={
                        refeicoes.find((refeicao: IRefeicao) => refeicao.refeicao?.id === turno)?.cardapio
                    } />
                ))
            }
            {
                isError &&
                ([1, 2, 3, 4] as const).map((turno) => (
                    <Refeicao key={turno} turno={turno} />
                ))
            }

        </Secao>
    )
}
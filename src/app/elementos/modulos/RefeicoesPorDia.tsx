"use client"

import React, { useState } from "react";
import { Refeicao, RefeicaoLoading } from "../componentes/Refeicao/Refeicao";
import { Slider } from "../componentes/Slider";
import { fetchRefeicoesPorDia } from "@/app/actions/fetchRefeicoesPorDia";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { Secao } from "../basicos/Secao";
import { useQuery } from "@tanstack/react-query";
import { IRefeicao } from "../interfaces/IRefeicao";
import * as Tooltip from "@radix-ui/react-tooltip";


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

    // Tooltip
    const [tooltipAberto, setTooltipAberto] = useState(false);

    const handleAbrirTooltip = () => setTooltipAberto(true);
    const handleFecharTooltip = () => setTooltipAberto(false);

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
                        <Tooltip.Provider delayDuration={100}>
                            <Tooltip.Root open={tooltipAberto}>
                                <Tooltip.Trigger asChild
                                    onMouseEnter={handleAbrirTooltip}
                                    onFocus={handleAbrirTooltip}
                                    onMouseLeave={handleFecharTooltip}
                                    onBlur={handleFecharTooltip}
                                >
                                    <button name='Ver mais informações'>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-vermelho-400">
                                            <path d="M6.6 4.2H5.4V3H6.6M6.6 9H5.4V5.4H6.6M6 0C5.21207 0 4.43185 0.155195 3.7039 0.456723C2.97595 0.758251 2.31451 1.20021 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.31451 10.7998 2.97595 11.2417 3.7039 11.5433C4.43185 11.8448 5.21207 12 6 12C7.5913 12 9.11742 11.3679 10.2426 10.2426C11.3679 9.11742 12 7.5913 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 0 6 0Z" />
                                        </svg>
                                    </button>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content
                                        className="bg-branco-400 border data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                        sideOffset={5}
                                    >
                                        <div>
                                            Nenhuma refeição encontrada para esta data.
                                        </div>
                                        <Tooltip.Arrow className="fill-branco-400" />
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>
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
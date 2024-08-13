import React from "react";
import { CabecalhoDeSecao } from "../../basicos/CabecalhoDeSecao";
import { Secao } from "../../basicos/Secao"
import { RefeicaoDoCardapio } from "../../componentes/RefeicaoDoCardapio";
import { fetchRefeicoesPorDia } from "@/app/actions/fetchRefeicoesPorDia";
import { SliderServerSide } from "../../componentes/SliderServerSide";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { ModalAdicionarCardapio } from "./ModalAdicionarCardapio";

export const Cardapios = async ({ searchParams }: { searchParams: URLSearchParams }) => {
    const data = searchParams.get('dataCardapio') || new Date().toISOString().split('T')[0];

    const cardapios = await fetchRefeicoesPorDia({ data });

    const anterior = DatasHelper.getDataAnterior(data);
    const posterior = DatasHelper.getDataPosterior(data);

    const handlePrevious: string = (searchParams.set("dataCardapio", anterior), `/nutricionista?${searchParams.toString()}`);
    const handleNext: string = (searchParams.set("dataCardapio", posterior), `/nutricionista?${searchParams.toString()}`);

    return (
        <Secao className="flex flex-col gap-y-4">
            <CabecalhoDeSecao titulo='Cardápios' />
            {
                cardapios.length ?
                    cardapios.map((refeicao, index) => (
                        refeicao.refeicao &&
                        refeicao.refeicao.id &&
                        <RefeicaoDoCardapio turno={refeicao.refeicao.id as 1 | 2 | 3 | 4} key={index} {...refeicao} />
                    )) :
                    <p>Não há cardápios para esta data.</p>
            }
            <ModalAdicionarCardapio.BotaoDeAbrir />
            <SliderServerSide onNext={handleNext} onPrevious={handlePrevious} texto={DatasHelper.converterParaFormatoBrasileiro(data)} />
        </Secao>
    );
}
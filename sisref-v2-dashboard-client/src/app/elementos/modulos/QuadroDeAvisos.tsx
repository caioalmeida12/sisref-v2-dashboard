import React from "react";
import { Secao } from "../basicos/Secao"
import { AvisoDoQuadro } from "./AvisoDoQuadro";
import { CabecalhoDeSecao } from "../basicos/CabecalhoDeSecao";
import { SliderServerSide } from "../componentes/SliderServerSide";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";

export const QuadroDeAvisos = async ({searchParams} : {searchParams: URLSearchParams}) => {
    let data = searchParams.get("dataAviso") || new Date().toISOString().split("T")[0];

    const anterior = DatasHelper.getDataAnterior(data);
    const posterior = DatasHelper.getDataPosterior(data);

    const handlePrevious: string = (searchParams.set("dataAviso", anterior), `/nutricionista?${searchParams.toString()}`);
    const handleNext: string = (searchParams.set("dataAviso", posterior), `/nutricionista?${searchParams.toString()}`);

    return (
        <Secao className="flex flex-col gap-y-4">
            <CabecalhoDeSecao titulo="Quadro de avisos" />
            <AvisoDoQuadro titulo="Aviso 1" texto="Texto do aviso 1" textoBotao="Remover"/>
            <SliderServerSide texto={DatasHelper.converterParaFormatoBrasileiro(data)} onNext={handleNext} onPrevious={handlePrevious} />
        </Secao>
    );
}
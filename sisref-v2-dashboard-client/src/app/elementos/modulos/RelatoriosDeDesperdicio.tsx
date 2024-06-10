import React from "react";

import { Botao } from "../basicos/Botao";
import { CabecalhoDeSecao } from "../basicos/CabecalhoDeSecao";
import { Secao } from "../basicos/Secao"
import { RelatorioDesperdicio } from "../componentes/RelatorioDesperdicio";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { SliderServerSide } from "../componentes/SliderServerSide";

export const RelatoriosDeDesperdicio = ({data} : {data?: string}) => {
    if (!data) data = new Date().toISOString().split("T")[0];

    // Resetar a data para o dia primeiro do mês
    data = data.split("-").slice(0, 2).join("-") + "-01";

    const anterior = DatasHelper.getMesAnterior(data);
    const posterior = DatasHelper.getMesPosterior(data);
    
    const handleNext = `/nutricionista?data=${posterior}`;
    const handlePrevious = `/nutricionista?data=${anterior}`;

    return (
        <Secao className="flex flex-col gap-y-4">
            <CabecalhoDeSecao titulo="Relatórios de desperdício" />
            <RelatorioDesperdicio variante="card" data={data}/>
            <Botao variante="adicionar" texto="Adicionar relatório" />
            <SliderServerSide texto={DatasHelper.converterParaFormatoBrasileiro(data)} onNext={handleNext} onPrevious={handlePrevious}/>
        </Secao>
    );
}
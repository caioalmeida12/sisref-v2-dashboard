import React from "react";

import { Botao } from "../basicos/Botao";
import { CabecalhoDeSecao } from "../basicos/CabecalhoDeSecao";
import { Secao } from "../basicos/Secao"
import { RelatorioDesperdicio } from "../componentes/RelatorioDesperdicio";
import { Slider } from "../componentes/Slider";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";

export const RelatoriosDeDesperdicio = ({data} : {data?: string}) => {
    if (!data) data = new Date().toISOString().split("T")[0];

    return (
        <Secao className="flex flex-col gap-y-4">
            <CabecalhoDeSecao titulo="Relatórios de desperdício" />
            <RelatorioDesperdicio variante="card" data={data}/>
            <Botao variante="adicionar" texto="Adicionar relatório" />
            <Slider texto={DatasHelper.converterParaFormatoBrasileiro(data)} />
        </Secao>
    );
}
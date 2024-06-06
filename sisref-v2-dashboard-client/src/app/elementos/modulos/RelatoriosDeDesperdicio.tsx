"use client"

import React from "react";

import { useState } from "react";
import { Botao } from "../basicos/Botao";
import { CabecalhoDeSecao } from "../basicos/CabecalhoDeSecao";
import { Secao } from "../basicos/Secao"
import { RelatorioDesperdicio } from "../componentes/RelatorioDesperdicio";
import { Slider } from "../componentes/Slider";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";

export const RelatoriosDeDesperdicio = () => {
    const [data, setData] = useState(new Date().toISOString())


    return (
        <Secao className="flex flex-col gap-y-4">
            <CabecalhoDeSecao titulo="Relatórios de desperdício" />
            <RelatorioDesperdicio variante="card" />
            <Botao variante="adicionar" texto="Adicionar relatório" />
            <Slider texto={DatasHelper.converterParaFormatoBrasileiro(data)} />
        </Secao>
    );
}
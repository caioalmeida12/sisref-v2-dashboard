import React from "react";

import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { Secao } from "../basicos/Secao";
import { Botao } from "../basicos/Botao";
import { fetchRelatorioDeDesperdicio } from "@/app/lib/actions/FetchRelatorioDeDesperdicio";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const Card = async ({ data }: { data: string }) => {
    const relatorio = await fetchRelatorioDeDesperdicio({ data })

    if (!relatorio || 'message' in relatorio) return <p>{relatorio?.message || "Relatório não encontrado para data"}</p>

    return (
        <Secao className="flex flex-col gap-y-2">
            <p className="font-bold">{DatasHelper.converterParaFormatoBrasileiro(data)}</p>

            <div
                dangerouslySetInnerHTML={{
                    __html: DOMPurify(new JSDOM("<!DOCTYPE html>").window).sanitize(
                        relatorio.content
                    ),
                }}
            />

            <Botao variante="remover" texto="Remover"></Botao>
        </Secao>
    )
}

export const RelatorioDesperdicio = ({ data, variante }: { data: string, variante: "card" | "modal" }) => {
    return variante === "card" ? <Card data={data} /> : null
}
import { HistoricoDeRefeicoes } from "@/app/elementos/modulos/HistoricoDeRefeicoes";
import React from "react";

export default function HistoricoDeRefeicoesParallelPage({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return <HistoricoDeRefeicoes forcarExibicao={(searchParams?.pagina === 'historicoDeRefeicoes')} />
}
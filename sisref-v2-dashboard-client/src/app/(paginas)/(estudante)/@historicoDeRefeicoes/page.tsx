import { HistoricoDeRefeicoes } from "@/app/elementos/modulos/HistoricoDeRefeicoes";
import React from "react";

export default function HistoricoDeRefeicoesParallelPage({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return <HistoricoDeRefeicoes forcarExibicao={(searchParams?.pagina === 'historicoDeRefeicoes')} />
}
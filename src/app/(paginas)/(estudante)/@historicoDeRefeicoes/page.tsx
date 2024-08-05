"use client"

import { HistoricoDeRefeicoes } from "@/app/elementos/modulos/HistoricoDeRefeicoes";
import { CustomQueryClientProvider } from "@/app/lib/elementos/CustomQueryProviderWrapper";
import React from "react";

export default function HistoricoDeRefeicoesParallelPage({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return (
        <CustomQueryClientProvider>
            <HistoricoDeRefeicoes forcarExibicao={(searchParams?.pagina === 'historicoDeRefeicoes')} />
        </CustomQueryClientProvider>
    )
}
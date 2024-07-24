"use client"

import { HistoricoDeRefeicoes } from "@/app/elementos/modulos/HistoricoDeRefeicoes";
import { queryClient } from "@/app/lib/elementos/QueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
        <QueryClientProvider client={queryClient}>
            <HistoricoDeRefeicoes forcarExibicao={(searchParams?.pagina === 'historicoDeRefeicoes')} />
        </QueryClientProvider>
    )
}
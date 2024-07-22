"use client"
import { RefeicoesPorDia } from "@/app/elementos/modulos/RefeicoesPorDia";
import { RefeicoesProvider } from "@/app/lib/elementos/RefeicoesContext";
import React from "react";

export default function RefeicoesPorDiaParallelPage({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return (
        <RefeicoesProvider>
            <RefeicoesPorDia forcarExibicao={(searchParams?.pagina === 'refeicoesPorDia' || searchParams?.pagina == undefined)} />
        </RefeicoesProvider>
    );
}
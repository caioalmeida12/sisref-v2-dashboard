"use client"
import { RefeicoesPorDia } from "@/app/elementos/modulos/RefeicoesPorDia";
import React from "react";

import {
    QueryClientProvider,
} from '@tanstack/react-query'
import { queryClient } from "@/app/lib/elementos/QueryClient";

export default function RefeicoesPorDiaParallelPage({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <RefeicoesPorDia forcarExibicao={(searchParams?.pagina === 'refeicoesPorDia' || searchParams?.pagina == undefined)} />
        </QueryClientProvider>
    );
}
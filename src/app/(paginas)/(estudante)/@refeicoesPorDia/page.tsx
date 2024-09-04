"use client"
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CustomQueryClientProvider } from "@/app/lib/elementos/CustomQueryProviderWrapper";
import { RefeicoesPorDia } from "@/app/elementos/modulos/estudante/RefeicoesPorDia";

export default function RefeicoesPorDiaParallelPage({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return (
        <CustomQueryClientProvider>
            <RefeicoesPorDia forcarExibicao={(searchParams?.pagina === 'refeicoesPorDia' || searchParams?.pagina == undefined)} />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </CustomQueryClientProvider>
    );
}
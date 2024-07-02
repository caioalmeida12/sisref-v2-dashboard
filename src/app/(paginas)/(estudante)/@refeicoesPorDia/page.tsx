import { RefeicoesPorDia } from "@/app/elementos/modulos/RefeicoesPorDia";
import React from "react";

export default function RefeicoesPorDiaParallelPage({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return <RefeicoesPorDia forcarExibicao={(searchParams?.pagina === 'refeicoesPorDia' || searchParams?.pagina == undefined)} />
}
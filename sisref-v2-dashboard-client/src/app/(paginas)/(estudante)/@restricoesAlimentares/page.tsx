import { RestricoesAlimentares } from "@/app/elementos/modulos/RestricoesAlimentares/RestricoesAlimentares";
import React from "react";

export default function RestricoesAlimentaresParallelPage({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return <RestricoesAlimentares forcarExibicao={(searchParams?.pagina === 'restricoesAlimentares')} />
}
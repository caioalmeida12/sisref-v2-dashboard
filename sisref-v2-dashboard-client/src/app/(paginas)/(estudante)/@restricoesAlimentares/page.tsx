import { RestricoesAlimentares } from "@/app/elementos/modulos/RestricoesAlimentares/RestricoesAlimentares";
import React from "react";

export default function RestricoesAlimentaresParallelPage({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return <RestricoesAlimentares forcarExibicao={(searchParams?.pagina === 'restricoesAlimentares')} />
}
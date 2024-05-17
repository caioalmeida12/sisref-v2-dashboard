import React from "react";
import { RefeicoesAutorizadas } from "@/app/elementos/modulos/RefeicoesAutorizadas";

export default function RefeicoesAutorizadasParallelPage({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return <RefeicoesAutorizadas forcarExibicao={(searchParams?.pagina === 'refeicoesAutorizadas')} />
}
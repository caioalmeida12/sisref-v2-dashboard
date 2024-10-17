import { RefeicoesAutorizadas } from "@/app/elementos/modulos/estudante/RefeicoesAutorizadas";
import React from "react";

export default async function RefeicoesAutorizadasParallelPage(
  props: {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return (
    <RefeicoesAutorizadas
      forcarExibicao={searchParams?.pagina === "refeicoesAutorizadas"}
    />
  );
}

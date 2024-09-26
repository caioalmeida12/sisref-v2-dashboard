import { RefeicoesAutorizadas } from "@/app/elementos/modulos/estudante/RefeicoesAutorizadas";
import React from "react";

export default function RefeicoesAutorizadasParallelPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <RefeicoesAutorizadas
      forcarExibicao={searchParams?.pagina === "refeicoesAutorizadas"}
    />
  );
}

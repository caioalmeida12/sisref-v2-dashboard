"use client";

import { HistoricoDeRefeicoes } from "@/app/elementos/modulos/estudante/HistoricoDeRefeicoes";
import { CustomQueryClientProvider } from "@/app/lib/elementos/CustomQueryProviderWrapper";
import React, { use } from "react";

export default function HistoricoDeRefeicoesParallelPage(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = use(props.searchParams!);
  const params = use(props.params);
  return (
    <CustomQueryClientProvider>
      <HistoricoDeRefeicoes
        forcarExibicao={searchParams?.pagina === "historicoDeRefeicoes"}
      />
    </CustomQueryClientProvider>
  );
}

import { RestricoesAlimentares } from "@/app/elementos/modulos/estudante/RestricoesAlimentares/RestricoesAlimentares";
import React from "react";

export default async function RestricoesAlimentaresParallelPage(
  props: {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return (
    <RestricoesAlimentares
      forcarExibicao={searchParams?.pagina === "restricoesAlimentares"}
    />
  );
}

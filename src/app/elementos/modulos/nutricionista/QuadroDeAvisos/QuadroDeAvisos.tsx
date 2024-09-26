import React from "react";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { CabecalhoDeSecao } from "@elementos/basicos/CabecalhoDeSecao";
import { Secao } from "@elementos/basicos/Secao";
import { SliderServerSide } from "@elementos//componentes/SliderServerSide";
import { AvisoDoQuadro } from "./AvisoDoQuadro";

export const QuadroDeAvisos = async ({
  searchParams,
}: {
  searchParams: URLSearchParams;
}) => {
  const data =
    searchParams.get("dataAviso") || new Date().toISOString().split("T")[0];

  const anterior = DatasHelper.getDataAnterior(data);
  const posterior = DatasHelper.getDataPosterior(data);

  const handlePrevious: string =
    (searchParams.set("dataAviso", anterior),
    `/nutricionista?${searchParams.toString()}`);
  const handleNext: string =
    (searchParams.set("dataAviso", posterior),
    `/nutricionista?${searchParams.toString()}`);

  return (
    <Secao className="flex flex-col gap-y-4">
      <CabecalhoDeSecao titulo="Quadro de avisos" />
      <AvisoDoQuadro
        titulo="Aviso 1"
        texto="Texto do aviso 1"
        textoBotao="Remover"
      />
      <SliderServerSide
        texto={DatasHelper.converterParaFormatoBrasileiro(data)}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Secao>
  );
};

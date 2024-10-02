import React from "react";

import { NomeDaRefeicao } from "@elementos/basicos/NomeDaRefeicao";
import { HorarioDaRefeicao } from "@elementos/basicos/HorarioDaRefeicao";
import { Secao } from "@elementos/basicos/Secao";
import { TRefeicao } from "@/app/interfaces/TRefeicao";

interface RefeicaoAutorizadaProps {
  dias: string[];
  refeicao: TRefeicao;
}

export const RefeicaoAutorizada = ({
  dias,
  refeicao,
}: RefeicaoAutorizadaProps) => {
  const diasAutorizados = dias.map((dia) => dia.toLocaleLowerCase()).join(", ");

  return (
    <Secao>
      <div className="flex flex-col gap-y-2 rounded">
        <div className="flex items-start justify-between">
          <NomeDaRefeicao variante={"manha"} />
          <HorarioDaRefeicao variante="horario" horarios={refeicao} />
        </div>
        <div>
          <b>Dias autorizados:</b>{" "}
          <span>{diasAutorizados === "" ? "nenhum" : diasAutorizados}</span>
        </div>
      </div>
    </Secao>
  );
};

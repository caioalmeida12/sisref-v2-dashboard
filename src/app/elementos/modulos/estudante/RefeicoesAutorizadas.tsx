"use client"

import React from "react";
import { Secao } from "@elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@elementos/basicos/CabecalhoDeSecao";
import { RefeicaoAutorizada } from "@elementos/componentes/RefeicaoAutorizada";
import { InformacoesDeEstudante } from "./InformacoesDeEstudante";
import { buscarRefeicoesAutorizadas } from "@/app/actions/estudante";
import { TBuscarRefeicoesAutorizadas } from "@/app/interfaces/TBuscarRefeicoesAutorizadas";
import { useQuery } from "@tanstack/react-query";

const pegarOsDiasDaSemanaAutorizados = (
  refeicoesAutorizadas: TBuscarRefeicoesAutorizadas[],
  idDaRefeicao: number,
) => {
  const diasQueSaoAutorizados: string[] = [];
  refeicoesAutorizadas
    .filter((refeicao) => refeicao.meal_id === idDaRefeicao)
    .map((refeicao) => {
      if (refeicao.monday === 1) diasQueSaoAutorizados.push("segunda-feira");
      if (refeicao.tuesday === 1) diasQueSaoAutorizados.push("terça-feira");
      if (refeicao.wednesday === 1) diasQueSaoAutorizados.push("quarta-feira");
      if (refeicao.thursday === 1) diasQueSaoAutorizados.push("quinta-feira");
      if (refeicao.friday === 1) diasQueSaoAutorizados.push("sexta-feira");
      if (refeicao.saturday === 1) diasQueSaoAutorizados.push("sábado");
    });

  if (diasQueSaoAutorizados.length === 6) return ["segunda a sábado"];
  if (diasQueSaoAutorizados.length === 5) return ["segunda a sexta"];
  if (diasQueSaoAutorizados.length === 0) return ["não autorizado"];

  return diasQueSaoAutorizados;
};

export const RefeicoesAutorizadas = () => {
  const { data: refeicoesAutorizadas = [] } = useQuery({
    queryKey: ["refeicoesAutorizadas"],
    queryFn: buscarRefeicoesAutorizadas,
    initialData: [],
  });

  type RefeicoesMap = {
    [K in 1 | 2 | 3 | 4]?: {
      refeicao: (typeof refeicoesAutorizadas)[number];
      dias: ReturnType<typeof pegarOsDiasDaSemanaAutorizados>;
    };
  };

  const refeicoes = ([1, 2, 3, 4] as const).reduce<RefeicoesMap>(
    (acc, meal_id) => {
      const refeicao = refeicoesAutorizadas.find(
        (refeicao) => refeicao.meal.id === meal_id,
      );
      const dias = pegarOsDiasDaSemanaAutorizados(
        refeicoesAutorizadas,
        meal_id,
      );
      if (refeicao) {
        acc[meal_id] = { refeicao, dias };
      }
      return acc;
    },
    {},
  );

  return (
    <>
      <div className="block lg:hidden" >
        <InformacoesDeEstudante versaoMobileCompleta />
      </div>
      <Secao
        className="flex col-left scroll-m-16 flex-col gap-y-4 lg:flex"
        id="refeicoesAutorizadas"
      >
        <CabecalhoDeSecao titulo="Refeições autorizadas" />
        {Object.values(refeicoes).map((refeicao, index) => (
          <RefeicaoAutorizada
            key={index}
            dias={refeicao.dias}
            refeicao={refeicao.refeicao.meal}
          />
        ))}
      </Secao>
    </>
  );
};

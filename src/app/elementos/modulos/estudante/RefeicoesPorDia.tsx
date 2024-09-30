"use client";

import React, { useEffect, useState } from "react";
import {
  Refeicao,
  RefeicaoLoading,
} from "@elementos/componentes/Refeicao/Refeicao";
import { Slider } from "@elementos/componentes/Slider";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { Secao } from "@elementos/basicos/Secao";
import { useQuery } from "@tanstack/react-query";
import { CustomTooltipWrapper } from "@elementos/basicos/CustomTooltipWrapper";
import { buscarRefeicoesPorDia } from "@/app/actions/estudante";
import { TRefeicao, TRefeicaoECardapio } from "@/app/interfaces/TRefeicao";

export const RefeicoesPorDia = ({
  forcarExibicao = false,
}: {
  forcarExibicao?: boolean;
}) => {
  const [dataDaPesquisa, setDataDaPesquisa] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [todasAsRefeicoes, setTodasAsRefeicoes] = useState<
    (TRefeicaoECardapio | { meal: TRefeicao; menu: null })[]
  >([]);
  const textoData =
    new Date().toISOString().split("T")[0] === dataDaPesquisa
      ? "hoje"
      : DatasHelper.converterParaFormatoBrasileiro(dataDaPesquisa);

  const { data: refeicoesEncontradas, isLoading } = useQuery({
    queryKey: ["refeicoesPorDia", dataDaPesquisa],
    queryFn: () => buscarRefeicoesPorDia({ data: dataDaPesquisa }),
  });

  useEffect(() => {
    // Sempre é necessário ter 4 refeições, mesmo que não tenha sido encontrada nenhuma. Essas refeições são as refeições padrão e têm meal.id de 1 a 4.
    const refeicoesAdicionadas = [1, 2, 3, 4].map((id) => {
      return (
        refeicoesEncontradas?.find((refeicao) => refeicao.meal.id === id) || {
          meal: {
            id: id,
            description: "",
            qtdTimeReservationStart: 0,
            qtdTimeReservationEnd: 0,
            timeStart: "",
            timeEnd: "",
            campus_id: 1,
          },
          menu: null,
        }
      );
    });

    setTodasAsRefeicoes(refeicoesAdicionadas);
  }, [refeicoesEncontradas]);

  // Limitar a distância de dias entre a data atual e a data selecionada
  const dataSelecionada = new Date(dataDaPesquisa).toISOString().split("T")[0];
  const diferencaDias = DatasHelper.getDiferenciaEmDias(dataSelecionada);

  return (
    <Secao
      className={`${forcarExibicao ? "flex" : "hidden"} flex-col gap-y-4 lg:grid lg:grid-cols-2 lg:gap-4`}
    >
      <Slider
        texto={`Refeições para ${textoData}`}
        className="col-span-2 bg-preto-400"
        onNext={() => {
          if (diferencaDias > 7) return;

          const amanha = DatasHelper.getDataPosterior(dataDaPesquisa);
          setDataDaPesquisa(amanha);
        }}
        onPrevious={() => {
          if (diferencaDias < -7) return;

          const ontem = DatasHelper.getDataAnterior(dataDaPesquisa);
          setDataDaPesquisa(ontem);
        }}
        tooltip={
          refeicoesEncontradas?.length === 0 && (
            <CustomTooltipWrapper
              elementoContent={
                <p>Nenhuma refeição encontrada para esta data.</p>
              }
              elementoTrigger={
                <div className="flex h-full flex-col justify-center">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-vermelho-400"
                  >
                    <path d="M6.6 4.2H5.4V3H6.6M6.6 9H5.4V5.4H6.6M6 0C5.21207 0 4.43185 0.155195 3.7039 0.456723C2.97595 0.758251 2.31451 1.20021 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.31451 10.7998 2.97595 11.2417 3.7039 11.5433C4.43185 11.8448 5.21207 12 6 12C7.5913 12 9.11742 11.3679 10.2426 10.2426C11.3679 9.11742 12 7.5913 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 0 6 0Z" />
                  </svg>
                </div>
              }
            />
          )
        }
      />
      {isLoading &&
        ([1, 2, 3, 4] as const).map((_, index) => (
          <RefeicaoLoading key={index} />
        ))}
      {!isLoading &&
        refeicoesEncontradas &&
        todasAsRefeicoes.map((refeicao) =>
          // Se a refeição não for encontrada, passar o turno da refeição para o componente Refeicao
          // O componente refeição, por sua vez, irá exibir uma mensagem de refeição indisponível
          refeicao.menu && refeicao.meal ? (
            <Refeicao {...refeicao} key={refeicao.meal.id} />
          ) : (
            <Refeicao turno={refeicao.meal.id} key={refeicao.meal.id} />
          ),
        )}
    </Secao>
  );
};

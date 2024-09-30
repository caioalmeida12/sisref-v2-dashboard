"use client";

import React from "react";
import { Secao } from "@elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@elementos/basicos/CabecalhoDeSecao";
import {
  RefeicaoDoHistorico,
  RefeicaoDoHistoricoLoading,
} from "@elementos/componentes/RefeicaoDoHistorico/RefeicaoDoHistorico";
import { useQuery } from "@tanstack/react-query";
import { TRefeicaoDoHistorico } from "@/app/interfaces/TRefeicaoDoHistorico";
import { IRespostaDeAction } from "@/app/interfaces/IRespostaDeAction";

const QUANTOS_TICKETS_MOSTRAR = 10;

export const HistoricoDeRefeicoes = ({
  forcarExibicao = false,
}: {
  forcarExibicao?: boolean;
}) => {
  const {
    data: ticketsMaisRecentes,
    isFetching,
    isError,
  } = useQuery<TRefeicaoDoHistorico[]>({
    queryKey: ["historico-de-refeicoes"],
    queryFn: async () => {
      // este componente não utiliza o `buscarTickets` e `buscarTicketsSemJustificativa` do arquivo `estudante.ts` por questões de performance
      // explicadas no arquivo `historico-de-refeicoes/route.ts`
      const resposta = await fetch(`/api/historico-de-refeicoes`);

      if (!resposta.ok) {
        return [];
      }

      const json: IRespostaDeAction<TRefeicaoDoHistorico> =
        await resposta.json();

      return json.sucesso ? json.resposta : [];
    },
    initialData: [],
  });

  return (
    <Secao
      className={`${forcarExibicao ? "flex" : "hidden"} flex-col gap-y-4 lg:flex`}
    >
      <CabecalhoDeSecao titulo="Histórico de Refeições" />
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4">
        {isFetching &&
          Array.from({ length: QUANTOS_TICKETS_MOSTRAR }).map((_, index) => (
            <RefeicaoDoHistoricoLoading key={index} />
          ))}
        {!isFetching &&
          !isError &&
          ticketsMaisRecentes.map((refeicao, index) => (
            <RefeicaoDoHistorico key={index} {...refeicao} />
          ))}
        {isError && <p>Não foi possível carregar o histórico de refeições</p>}
      </div>
    </Secao>
  );
};

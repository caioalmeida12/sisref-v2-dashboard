import React from "react";
import { HorarioDaRefeicao } from "@elementos/basicos/HorarioDaRefeicao";
import { NomeDaRefeicao } from "@elementos/basicos/NomeDaRefeicao";
import { Secao } from "@elementos/basicos/Secao";
import { StatusDaRefeicao } from "@elementos/basicos/StatusDaRefeicao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import Skeleton from "react-loading-skeleton";
import { RefeicaoNaoJustificada } from "./RefeicaoDoHistoricoNaoJustificada";
import { TRefeicaoDoHistorico } from "@/app/interfaces/TRefeicaoDoHistorico";

const getVarianteNomeRefeicaoPorTurno = (turno: number) => {
  switch (turno) {
    case 1:
      return "manha";
    case 2:
      return "almoco";
    case 3:
      return "tarde";
    case 4:
      return "noite";
    default:
      return "manha";
  }
};

const elementoStatusRefeicaoPorTextoStatusRefeicao = {
  "a-ser-utilizado": (
    <StatusDaRefeicao
      cor="verde-300"
      icone="circulo-check"
      texto="Reservado"
      textoTooltip="Você ainda pode utilizar este ticket."
    />
  ),
  "nao-utilizado": (
    <StatusDaRefeicao
      cor="amarelo-200"
      icone="circulo-check"
      texto="Disponível"
      textoTooltip="Você reservou esta refeição e ainda pode utilizar este ticket."
    />
  ),
  justificado: (
    <StatusDaRefeicao
      cor="azul-400"
      icone="circulo-check"
      texto="Justificado"
      textoTooltip="Você justificou sua ausência a esta refeição."
    />
  ),
  cancelado: (
    <StatusDaRefeicao
      cor="vermelho-400"
      icone="tag-x"
      texto="Cancelado"
      textoTooltip="Você cancelou esta reserva."
    />
  ),
  utilizado: (
    <StatusDaRefeicao
      cor="verde-300"
      icone="circulo-check"
      texto="Utilizado"
      textoTooltip="Você reservou e já utilizou este ticket."
    />
  ),
  "nao-utilizado-sem-justificativa": (
    <StatusDaRefeicao
      cor="vermelho-400"
      icone="circulo-x"
      texto="Não justificado"
      textoTooltip="Você não esteve presente nesta refeição. Justifique sua ausência."
    />
  ),
} as const;

/**
 * Converte a descrição do cardápio em um array de strings.
 * @param descricao - A descrição do cardápio.
 * @returns O array de strings.
 */
const descricaoCardapioParaArrayStrings = (descricao: string) => {
  return descricao.split(/[;+]/).filter((naoVazio) => naoVazio);
};

export const RefeicaoDoHistorico = (props: TRefeicaoDoHistorico) => {
  if (!props.status || !props.meal.id) return null;

  return (
    <Secao className="flex flex-col gap-y-1">
      <div className="flex justify-between gap-x-2">
        <NomeDaRefeicao
          refeicao={{
            campus_id: props.campus_id,
            ...props.meal,
          }}
        />
        {
          elementoStatusRefeicaoPorTextoStatusRefeicao[
            props.status as keyof typeof elementoStatusRefeicaoPorTextoStatusRefeicao
          ]
        }
      </div>
      <HorarioDaRefeicao
        variante="horario-e-data"
        data={DatasHelper.converterParaFormatoBrasileiro(props.menu.date)}
        horarios={{
          qtdTimeReservationEnd: props.meal.qtdTimeReservationEnd,
          qtdTimeReservationStart: props.meal.qtdTimeReservationStart,
          timeEnd: DatasHelper.removerSegundosDoHorario(props.meal.timeEnd),
          timeStart: DatasHelper.removerSegundosDoHorario(props.meal.timeStart),
        }}
      />
      <p className="mt-2 leading-6">
        {descricaoCardapioParaArrayStrings(props.menu.description).map(
          (descricao, index) => (
            <React.Fragment key={index}>
              <span>{descricao}</span>
              <br />
            </React.Fragment>
          ),
        )}
      </p>

      {props.status === "nao-utilizado-sem-justificativa" && (
        <RefeicaoNaoJustificada
          ticket_id={props.id}
          studentJustification={props.studentJustification}
        />
      )}
    </Secao>
  );
};

export const RefeicaoDoHistoricoLoading = () => {
  return (
    <Secao className="flex flex-col gap-4">
      <div className="flex justify-between gap-x-2">
        <Skeleton containerClassName="w-[60%]" />
        <Skeleton containerClassName="w-[40%]" />
      </div>
      <div className="flex justify-between gap-x-2">
        <Skeleton containerClassName="w-[50%]" />
        <Skeleton containerClassName="w-[50%]" />
      </div>
      <p className="leading-6">
        <Skeleton width={"80%"} />
        <Skeleton width={"60%"} />
        <Skeleton width={"70%"} />
        <Skeleton width={"40%"} />
      </p>
    </Secao>
  );
};

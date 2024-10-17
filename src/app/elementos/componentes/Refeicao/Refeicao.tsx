import React, { useEffect, useState } from "react";
import { HorarioDaRefeicao } from "@elementos/basicos/HorarioDaRefeicao";
import { NomeDaRefeicao } from "@elementos/basicos/NomeDaRefeicao";
import { Secao } from "@elementos/basicos/Secao";
import { StatusDaRefeicao } from "@elementos/basicos/StatusDaRefeicao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { pegarStatusDaRefeicao } from "@/app/lib/elementos/Refeicao";
import Skeleton from "react-loading-skeleton";
import {
  TCardapio,
  TRefeicao,
  TRefeicaoECardapio,
} from "@/app/interfaces/TRefeicao";
import { Botao } from "../../basicos/Botao";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { cancelarRefeicao, reservarRefeicao } from "@/app/actions/estudante";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ModalGeral } from "../../modulos/comuns/ModalGeral/ModalGeral";
import { BotaoDiv } from "../../basicos/BotaoDiv";
import { IRespostaDeAction } from "@/app/interfaces/IRespostaDeAction";
import { ModalCancelarRefeicao } from "./ModalCancelarRefeicao";

const elementoStatusRefeicaoPorTextoStatusRefeicao = {
  disponivel: (
    <StatusDaRefeicao
      cor="verde-300"
      icone="circulo-check"
      texto="Disponível"
      textoTooltip="Você pode reservar esta refeição."
    />
  ),
  encerrado: (
    <StatusDaRefeicao
      cor="cinza-600"
      icone="circulo-x"
      texto="Encerrado"
      textoTooltip="O horário de reservas já foi ultrapassado."
    />
  ),
  bloqueado: (
    <StatusDaRefeicao
      cor="amarelo-200"
      icone="cadeado"
      texto="Bloqueado"
      textoTooltip="Esta refeição não está liberada para você."
    />
  ),
  cancelado: (
    <StatusDaRefeicao
      cor="vermelho-400"
      icone="tag-x"
      texto="Cancelado"
      textoTooltip="Você cancelou esta refeição."
    />
  ),
  reservado: (
    <StatusDaRefeicao
      cor="verde-300"
      icone="circulo-check"
      texto="Reservado"
      textoTooltip="Você reservou esta refeição."
    />
  ),
  indisponivel: (
    <StatusDaRefeicao
      cor="cinza-600"
      icone="relogio-x"
      texto="Indisponível"
      textoTooltip="Está muito cedo ou muito tarde para reservar esta refeição."
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

type IRefeicaoProps =
  | {
      meal: TRefeicao;
      menu: TCardapio;
    }
  | {
      meal: TRefeicao;
    };

const RefeicaoCurta = (props: TRefeicaoECardapio) => {
  const StatusRefeicao =
    elementoStatusRefeicaoPorTextoStatusRefeicao[pegarStatusDaRefeicao(props)];

  return (
    <Secao className="h-fit">
      <div className="flex justify-between">
        <NomeDaRefeicao refeicao={props.meal} />
        {StatusRefeicao}
      </div>
    </Secao>
  );
};

const RefeicaoLonga = (props: TRefeicaoECardapio, comBotao: boolean) => {
  if ("turno" in props) return <RefeicaoCurta {...props} />;
  const [botaoDesativado, setBotaoDesativado] = useState(true);
  const { atualizarMensagem, mensagemDeRespostaRef } = useMensagemDeResposta();

  useEffect(() => {
    const timer = setTimeout(() => {
      setBotaoDesativado(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const queryClient = useQueryClient();

  const { mutate: reservar } = useMutation({
    mutationFn: () =>
      reservarRefeicao({ meal_id: props.meal.id, date: props.menu.date }),
    mutationKey: ["reservarRefeicao", props.meal.id, props.menu.date],
    onMutate: () => {
      atualizarMensagem({ mensagem: "Reservando..." });
    },
    onError: (error) => {
      atualizarMensagem({ mensagem: error.message, sucesso: false });
    },
    onSuccess: (resposta) => {
      queryClient.invalidateQueries({
        queryKey: ["refeicoesPorDia"],
      });

      queryClient.invalidateQueries({
        queryKey: ["historicoDeRefeicoes"],
      });

      atualizarMensagem(resposta);
    },
  });

  const StatusRefeicao =
    elementoStatusRefeicaoPorTextoStatusRefeicao[pegarStatusDaRefeicao(props)];
  const textoStatus = pegarStatusDaRefeicao(props);

  return (
    <Secao className="flex h-fit flex-col gap-y-1">
      <div className="flex justify-between">
        <NomeDaRefeicao refeicao={props.meal} />
        {StatusRefeicao}
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
      {comBotao && textoStatus === "disponivel" && (
        <div className="mt-2 flex flex-col gap-y-2">
          <div className="hidden" ref={mensagemDeRespostaRef}></div>
          <Botao
            texto="Reservar"
            variante="adicionar"
            onClick={() => reservar()}
          />
        </div>
      )}
      {comBotao && textoStatus === "reservado" && (
        <ModalCancelarRefeicao date={props.menu.date} meal_id={props.meal.id} />
      )}
    </Secao>
  );
};

const RefeicaoIndisponivel = ({ refeicao }: { refeicao: TRefeicao }) => {
  return (
    <Secao className="flex h-fit flex-col gap-y-2">
      <div className="flex justify-between">
        <NomeDaRefeicao refeicao={refeicao} />
        <StatusDaRefeicao
          cor="cinza-600"
          icone="relogio-x"
          texto="Indisponível"
          textoTooltip="Está muito cedo ou muito tarde para reservar esta refeição."
        />
      </div>
    </Secao>
  );
};

export const Refeicao = (props: IRefeicaoProps) => {
  if ("meal" in props && !("menu" in props)) {
    return <RefeicaoIndisponivel refeicao={props.meal} />;
  }

  const textoStatus = pegarStatusDaRefeicao(props);
  const comBotao = textoStatus === "disponivel" || textoStatus === "reservado";
  return RefeicaoLonga(props, comBotao);
};

export const RefeicaoLoading = () => {
  return (
    <Secao className="flex h-fit flex-col gap-y-2">
      <div className="flex justify-between">
        <Skeleton width={140} height={20} />
        <Skeleton width={80} height={20} />
      </div>
      <Skeleton width={"70%"} height={20} />
      <p className="leading-6">
        <Skeleton width={"60%"} height={20} />
        <Skeleton width={"70%"} height={20} />
        <Skeleton width={"50%"} height={20} />
        <Skeleton width={"45%"} height={20} />
      </p>
      <Skeleton width={"100%"} height={58} />
    </Secao>
  );
};

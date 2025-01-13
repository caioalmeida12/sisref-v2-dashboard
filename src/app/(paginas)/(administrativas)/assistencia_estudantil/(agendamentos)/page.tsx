"use client";

import * as Form from "@radix-ui/react-form";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import React, { useMemo } from "react";

import { buscarJustificativasNaoProcessadas } from "@/app/actions/assistencia_estudantil";
import {
  buscarRefeicoes,
  confirmarAgendamento,
  criarAgendamento,
  removerAgendamento,
} from "@/app/actions/nutricionista";
import { Badge } from "@/app/elementos/basicos/Badge";
import { Botao } from "@/app/elementos/basicos/Botao";
import { BotaoDiv } from "@/app/elementos/basicos/BotaoDiv";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";
import { Secao } from "@/app/elementos/basicos/Secao";
import { ModalJustificativasNaoProcessadas } from "@/app/elementos/modulos/assistencia_estudantil/Agendamentos/ModalJustificativasNaoProcessadas";
import { ModalGeral } from "@/app/elementos/modulos/comuns/ModalGeral/ModalGeral";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { IRespostaDeAction } from "@/app/interfaces/IRespostaDeAction";
import { IRespostaPaginada } from "@/app/interfaces/IRespostaPaginada";
import { IRequisicaoPaginadaQueryStates } from "@/app/interfaces/IRespostaPaginadaQueryStates";
import { TAgendamentoSchema } from "@/app/interfaces/TAgendamento";
import { FetchRouteHandler } from "@/app/lib/actions/FetchRouteHandler";
import { respostaPaginadaPadrao } from "@/app/lib/actions/RespostaPaginadaPadrao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { createColumnHelper } from "@tanstack/react-table";

export default function Agendamentos() {
  const [pesquisa, setPesquisa] = useQueryStates(
    {
      dataInicial: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
      dataFinal: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
    },
    {
      clearOnDefault: true,
    },
  );

  const [paginacao, setPaginacao] =
    useQueryStates<IRequisicaoPaginadaQueryStates>({
      last_page: parseAsInteger.withDefault(1),
      per_page: parseAsInteger.withDefault(50),
      page: parseAsInteger.withDefault(1),
      total: parseAsInteger.withDefault(50),
    });

  const { data: nomesDasRefeicoes, isLoading: isLoadingRefeicoes } = useQuery({
    initialData: [],
    queryKey: ["tabelaDeRefeicoes"],
    queryFn: async () => {
      const resposta = await buscarRefeicoes();
      return resposta.sucesso ? resposta.resposta : [];
    },
  });

  const { data: justificativasNaoProcessadas } = useQuery({
    queryKey: ["justificativasNaoProcessadas"],
    queryFn: async () => {
      const resposta = await buscarJustificativasNaoProcessadas();
      return resposta.sucesso ? resposta.resposta : [];
    },
    refetchInterval: 1000 * 60 * 5,
    initialData: [],
  });

  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ["tabelaDeAgendamentos", paginacao.page, pesquisa],
    queryFn: async () => {
      const respostaInicial = await FetchRouteHandler.get(
        "/scheduling/list-by-date",
        paginacao,
        `date=${pesquisa.dataInicial}&final_date=${pesquisa.dataFinal ?? pesquisa.dataInicial}`,
      );

      if (!respostaInicial.ok) return respostaPaginadaPadrao;

      const json = (await respostaInicial.json()) as IRespostaDeAction<
        IRespostaPaginada<unknown>
      >;
      if (!json.sucesso) return respostaPaginadaPadrao;
      console.log("passou", json);

      const [resposta] = json.resposta;
      setPaginacao({
        last_page: resposta.last_page,
        page: resposta.current_page,
        total: resposta.total,
        per_page: resposta.per_page,
      });

      return {
        ...resposta,
        data: resposta.data.flatMap((ent) => {
          const parsed = TAgendamentoSchema.safeParse(ent);
          return parsed.success ? parsed.data : [];
        }),
      };
    },
    initialData: respostaPaginadaPadrao,
  });

  const colunasHelper =
    createColumnHelper<(typeof dadosDaTabela.data)[number]>();

  const colunas = useMemo(
    () => [
      colunasHelper.accessor("id", {
        cell: (props) => props.getValue(),
        header: "ID",
        meta: { filterVariant: "range" },
      }),
      colunasHelper.accessor("student.id", {
        cell: (props) => props.getValue(),
        header: "Código",
      }),
      colunasHelper.accessor("student.name", {
        cell: (props) => <p className="text-left">{props.getValue()}</p>,
        header: "Estudante",
        size: 750,
      }),
      colunasHelper.accessor("meal.description", {
        cell: (props) => (
          <div className="whitespace-nowrap">{props.getValue()}</div>
        ),
        header: "Refeição",
      }),
      colunasHelper.accessor("menu.description", {
        cell: (props) => (
          <div className="line-clamp-1 hover:line-clamp-none">
            {props.getValue()}
          </div>
        ),
        header: "Cardápio",
        size: 1000,
      }),
      colunasHelper.accessor("menu.date", {
        cell: (props) =>
          DatasHelper.converterParaFormatoBrasileiro(props.getValue()),
        header: "Data",
      }),
      colunasHelper.accessor("student.dateValid", {
        cell: (props) => (
          <Badge
            texto={props.getValue()}
            className="min-w-max whitespace-nowrap border-none bg-verde-300"
          />
        ),
        header: "Vencimento",
      }),
      colunasHelper.accessor("student.course.initials", {
        cell: (props) => props.getValue(),
        header: "Curso",
      }),
      colunasHelper.display({
        cell: (props) => (
          <div className="flex justify-center gap-x-2">
            <div className="relative h-5 w-5">
              <ModalGeral
                textoTitulo="Remover agendamento"
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent="Remover agendamento"
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Deletar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
                tipoDeBotaoPrincipal="remover"
                textoDescricao={[
                  "Você está prestes a remover o agendamento a seguir",
                ]}
                elementoDescricao={
                  <ul className="mt-2 list-disc pl-5">
                    <li>
                      ID: <strong>{props.row.original.id}</strong>
                    </li>
                    <li>
                      Estudante:{" "}
                      <strong>{props.row.original.student.name}</strong>
                    </li>
                    <li>
                      Cardápio:{" "}
                      <strong>{props.row.original.menu.description}</strong>
                    </li>
                    <li>
                      Refeição e Data:{" "}
                      <strong>
                        {props.row.original.meal.description} (
                        {DatasHelper.converterParaFormatoBrasileiro(
                          props.row.original.date,
                        )}
                        )
                      </strong>
                    </li>
                  </ul>
                }
                formulario={{
                  action: removerAgendamento,
                  queryKeysParaInvalidar: [["tabelaDeAgendamentos"]],
                  substantivoParaMensagemDeRetorno: "agendamento",
                  campos: [
                    {
                      type: "hidden",
                      name: "id",
                      value: props.row.original.id,
                    },
                  ],
                }}
              />
            </div>
            {!props.row.original.wasPresent && (
              <div className="relative h-5 w-5">
                <ModalGeral
                  textoTitulo="Confirmar agendamento"
                  elementoTrigger={
                    <CustomTooltipWrapper
                      elementoContent="Confirmar agendamento"
                      elementoTrigger={
                        <div className="relative h-5 w-5 cursor-pointer">
                          <Icone.Confirmar className="absolute inset-0 block h-full w-full" />
                        </div>
                      }
                    />
                  }
                  tipoDeBotaoPrincipal="confirmar"
                  textoDescricao={[
                    "Você está prestes a confirmar o agendamento a seguir:",
                  ]}
                  elementoDescricao={
                    <ul className="mt-2 list-disc pl-5">
                      <li>
                        ID: <strong>{props.row.original.id}</strong>
                      </li>
                      <li>
                        Estudante:{" "}
                        <strong>{props.row.original.student.name}</strong>
                      </li>
                      <li>
                        Cardápio:{" "}
                        <strong>{props.row.original.menu.description}</strong>
                      </li>
                      <li>
                        Refeição e Data:{" "}
                        <strong>
                          {props.row.original.meal.description} (
                          {DatasHelper.converterParaFormatoBrasileiro(
                            props.row.original.date,
                          )}
                          )
                        </strong>
                      </li>
                    </ul>
                  }
                  formulario={{
                    action: confirmarAgendamento,
                    queryKeysParaInvalidar: [["tabelaDeAgendamentos"]],
                    substantivoParaMensagemDeRetorno: "agendamento",
                    campos: [
                      {
                        type: "hidden",
                        name: "date",
                        value: props.row.original.menu.date,
                      },
                      {
                        type: "hidden",
                        name: "student_id",
                        value: props.row.original.student_id,
                      },
                      {
                        type: "hidden",
                        name: "meal_id",
                        value: props.row.original.meal.id,
                      },
                    ],
                  }}
                />
              </div>
            )}
          </div>
        ),
        enableResizing: false,
        header: "Ações",
      }),
    ],
    [],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const dataInicial = formData.get("dataInicial") as string;
    const dataFinal = formData.get("dataFinal") as string;

    setPesquisa({
      dataInicial,
      dataFinal,
    });
  };

  return (
    <Secao className="min-w-[768px] border-none">
      <Secao className="mx-auto flex max-w-[1440px] flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Agendamentos" />
        <Secao className="flex flex-wrap gap-y-2">
          <div className="flex items-end gap-x-4">
            <Form.Root
              className="flex items-end gap-x-2 gap-y-2"
              onSubmit={handleSubmit}
            >
              <Form.Field name="dataInicial" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">Data para busca</Form.Label>
                <Form.Control
                  type="date"
                  className="rounded px-2 py-1 outline outline-1 outline-cinza-600"
                  defaultValue={pesquisa.dataInicial}
                />
              </Form.Field>
              <Botao
                variante="adicionar"
                texto="Buscar"
                className="h-[36px] px-10 py-2 leading-tight"
                type="submit"
              />
            </Form.Root>
          </div>
          <div className="ml-auto mt-auto flex gap-x-2">
            <ModalJustificativasNaoProcessadas
              justificativas={justificativasNaoProcessadas}
            />
            <ModalGeral
              textoTitulo="Reservar para estudante"
              elementoTrigger={
                <BotaoDiv
                  className="h-[36px] bg-azul-400 px-10 py-2 leading-tight"
                  texto="Reservar para estudante"
                  variante="adicionar"
                />
              }
              textoDescricao={[
                "Preencha os campos abaixo para reservar para estudante",
              ]}
              tipoDeBotaoPrincipal="confirmar"
              formulario={{
                action: criarAgendamento,
                queryKeysParaInvalidar: [["tabelaDeAgendamentos"]],
                substantivoParaMensagemDeRetorno: "agendamento",
                campos: [
                  {
                    type: "number",
                    name: "student_id",
                    max: 20_000,
                    min: 1,
                    label: "Código de estudante",
                    placeholder: "ex: 2153",
                  },
                  {
                    type: "select",
                    estaCarregando: isLoadingRefeicoes,
                    label: "Refeição",
                    name: "meal_id",
                    opcoes: () =>
                      nomesDasRefeicoes.map((refeicao) => ({
                        texto: refeicao.description,
                        valor: refeicao.id,
                      })),
                  },
                  {
                    type: "date",
                    label: "Data do cardápio",
                    max: DatasHelper.getDataNDiasDepois(
                      DatasHelper.getDataDeHoje(),
                      7,
                    ),
                    min: DatasHelper.getDataDeHoje(),
                    name: "date",
                    placeholder: `ex: ${DatasHelper.getDataDeHoje()}`,
                    defaultValue: DatasHelper.getDataDeHoje(),
                  },
                ],
              }}
            />
          </div>
        </Secao>
        <Secao>
          <TabelaDeCrud
            colunas={colunas}
            dados={dadosDaTabela.data}
            estaCarregando={isLoadingDadosDaTabela}
            ordenacaoPadrao={[{ id: "id", desc: true }]}
            paginacaoNoServidor={{
              paginacao,
              setPaginacao,
            }}
          />
        </Secao>
      </Secao>
    </Secao>
  );
}

"use client";

import * as Form from "@radix-ui/react-form";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import React, { useMemo } from "react";

import { Botao } from "@/app/elementos/basicos/Botao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Secao } from "@/app/elementos/basicos/Secao";
import { StatusDaRefeicao } from "@/app/elementos/basicos/StatusDaRefeicao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { IRespostaDeAction } from "@/app/interfaces/IRespostaDeAction";
import { IRespostaPaginada } from "@/app/interfaces/IRespostaPaginada";
import { IRequisicaoPaginadaQueryStates } from "@/app/interfaces/IRespostaPaginadaQueryStates";
import {
  TRelatorioDeRefeicoes,
  TRelatorioDeRefeicoesSchema,
} from "@/app/interfaces/TRelatorioDeRefeicoes";
import { FetchRouteHandler } from "@/app/lib/actions/FetchRouteHandler";
import { respostaPaginadaPadrao } from "@/app/lib/actions/RespostaPaginadaPadrao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { createColumnHelper } from "@tanstack/react-table";

export default function Page() {
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

  const {
    data: dadosDaTabela,
    isFetching: isLoadingDadosDaTabela,
    refetch,
  } = useQuery({
    queryKey: ["relatorioDeRefeicoes", pesquisa, paginacao],
    queryFn: async () => {
      const respostaInicial = await FetchRouteHandler.get(
        "/report/list-scheduling",
        paginacao,
        `start_date=${pesquisa.dataInicial}&end_date=${pesquisa.dataFinal ?? pesquisa.dataInicial}`,
      );

      if (!respostaInicial.ok) return respostaPaginadaPadrao;

      const json = (await respostaInicial.json()) as IRespostaDeAction<
        IRespostaPaginada<unknown>
      >;
      if (!json.sucesso) return respostaPaginadaPadrao;

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
          const parsed = TRelatorioDeRefeicoesSchema.safeParse(ent);

          return parsed.success ? parsed.data : [];
        }),
      };
    },
    initialData: respostaPaginadaPadrao,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const dataInicial = formData.get("dataInicial") as string;
    const dataFinal = formData.get("dataFinal") as string;

    setPesquisa({ dataInicial, dataFinal });
    refetch();
  };

  const colunasHelper = createColumnHelper<TRelatorioDeRefeicoes>();

  const colunas = useMemo(
    () => [
      colunasHelper.accessor("id", {
        cell: (props) => props.getValue(),
        header: "ID",
        meta: { filterVariant: "range" },
      }),
      colunasHelper.accessor("name", {
        cell: (props) => <p className="text-left">{props.getValue()}</p>,
        header: "Estudante",
      }),
      colunasHelper.accessor("meal_description", {
        cell: (props) => props.getValue(),
        header: "Refeição",
      }),
      colunasHelper.accessor("date", {
        cell: (props) =>
          DatasHelper.converterParaFormatoBrasileiro(props.getValue()),
        header: "Data",
      }),
      colunasHelper.accessor("initials", {
        cell: (props) => props.getValue(),
        header: "Curso",
      }),
      {
        id: "Status",
        accessorFn: (props: TRelatorioDeRefeicoes) => {
          return pegarStatusDaRefeicao(props).tipo;
        },
        cell: (props: any) => {
          return (
            <div className="flex justify-center">
              {pegarStatusDaRefeicao(props.row.original).elemento}
            </div>
          );
        },
      },
    ],
    [colunasHelper],
  );

  const pegarStatusDaRefeicao = (
    refeicao: TRelatorioDeRefeicoes,
  ): { tipo: string; elemento: React.ReactNode } => {
    if (refeicao.wasPresent)
      return {
        tipo: "Utilizado",
        elemento: (
          <StatusDaRefeicao
            cor="verde-300"
            icone="circulo-check"
            texto="Utilizado"
            textoTooltip="A refeição foi reservada e o ticket já foi utilizado."
          />
        ),
      };

    if (refeicao.canceled_by_student)
      return {
        tipo: "Cancelado",
        elemento: (
          <StatusDaRefeicao
            cor="vermelho-400"
            icone="tag-x"
            texto="Cancelado"
            textoTooltip="Esta reserva foi cancelada."
          />
        ),
      };

    if (refeicao.absenceJustification)
      return {
        tipo: "Justificado",
        elemento: (
          <StatusDaRefeicao
            cor="azul-400"
            icone="circulo-check"
            texto="Justificado"
            textoTooltip={`A ausência a esta refeição foi justificada. Justificativa: ${refeicao.studentJustification}`}
          />
        ),
      };

    if (!refeicao.absenceJustification)
      return {
        tipo: "Ausente",
        elemento: (
          <StatusDaRefeicao
            cor="vermelho-400"
            icone="circulo-x"
            texto="Ausente"
            textoTooltip="A pessoa reservou mas não esteve presente nesta refeição. É necessário justificar a ausência."
          />
        ),
      };

    return {
      tipo: "Disponível",
      elemento: (
        <StatusDaRefeicao
          cor="amarelo-200"
          icone="circulo-check"
          texto="Disponível"
          textoTooltip="A refeição foi reservada e o ticket ainda pode ser utilizado."
        />
      ),
    };
  };

  return (
    <Secao className="min-w-[768px] border-none">
      <Secao className="mx-auto flex max-w-[1440px] flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Relatório de refeições" />
        <Secao className="flex flex-wrap gap-y-2">
          <div className="flex items-end gap-x-4">
            <Form.Root
              className="flex items-end gap-x-2 gap-y-2"
              onSubmit={handleSubmit}
            >
              <Form.Field name="dataInicial" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">Data Inicial</Form.Label>
                <Form.Control
                  type="date"
                  className="outline-cinza-600 rounded px-2 py-1 outline outline-1"
                  defaultValue={pesquisa.dataInicial}
                />
              </Form.Field>
              <Form.Field name="dataFinal" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">Data Final</Form.Label>
                <Form.Control
                  type="date"
                  className="outline-cinza-600 rounded px-2 py-1 outline outline-1"
                  defaultValue={pesquisa.dataFinal}
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
        </Secao>
        <Secao>
          <TabelaDeCrud
            colunas={colunas}
            dados={dadosDaTabela.data}
            estaCarregando={isLoadingDadosDaTabela}
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

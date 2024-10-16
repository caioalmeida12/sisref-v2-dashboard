"use client";

import React, { useMemo } from "react";
import { parseAsString, useQueryStates } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import * as Form from "@radix-ui/react-form";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Botao } from "@/app/elementos/basicos/Botao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { createColumnHelper } from "@tanstack/react-table";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { ModalAdicionarCardapio } from "@/app/elementos/modulos/nutricionista/Cardapios/ModalAdicionarCardapio";
import { ModalRemoverCardapio } from "@/app/elementos/modulos/nutricionista/Cardapios/ModalRemoverCardapio";
import { ModalEditarCardapio } from "@/app/elementos/modulos/nutricionista/Cardapios/ModalEditarCardapio";
import {
  buscarRefeicoes,
  buscarTabelaDeCardapios,
} from "@/app/actions/nutricionista";

export default function NutricionistaPage() {
  const [pesquisa, setPesquisa] = useQueryStates(
    {
      dataInicial: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
      dataFinal: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
    },
    {
      clearOnDefault: true,
    },
  );

  const { data: refeicoesDisponiveis } = useQuery({
    queryKey: ["refeicoes", pesquisa],
    queryFn: async () => {
      const resposta = await buscarRefeicoes();
      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: [],
  });

  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ["tabelaDeCardapios", pesquisa, refeicoesDisponiveis],
    queryFn: async () => {
      const resposta = await buscarTabelaDeCardapios({
        campus_id: 1,
        data: pesquisa.dataInicial,
        refeicoes_disponiveis: refeicoesDisponiveis,
      });
      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: [],
  });

  const colunasHelper = createColumnHelper<(typeof dadosDaTabela)[number]>();

  const colunas = useMemo(
    () => [
      colunasHelper.accessor("menu.id", {
        id: "menu.id",
        cell: (info) => info.getValue(),
        header: "ID",
        meta: { filterVariant: "range" },
      }),
      colunasHelper.accessor("menu.date", {
        cell: (info) =>
          (info.getValue() &&
            DatasHelper.converterParaFormatoBrasileiro(`${info.getValue()}`)) ||
          "Não informado",
        header: "Data",
      }),
      colunasHelper.accessor("meal.description", {
        cell: (info) => info.getValue(),
        header: "Refeição",
        meta: { filterVariant: "text" },
      }),
      colunasHelper.accessor("menu.description", {
        cell: (info) => info.getValue(),
        header: "Cardápio",
      }),
      colunasHelper.display({
        cell: (info) =>
          info.row.original.meal.id && info.row.original.menu.id != 0 ? (
            <div className="flex justify-center gap-x-2">
              <div className="relative h-5 w-5">
                <ModalRemoverCardapio refeicao_e_cardapio={info.row.original} />
              </div>
              <div className="relative h-5 w-5">
                <ModalEditarCardapio refeicao_e_cardapio={info.row.original} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-x-2">
              <ModalAdicionarCardapio refeicao_e_cardapio={info.row.original} />
            </div>
          ),
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
        <CabecalhoDeSecao titulo="Cardápios" />
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
              {/* <Form.Field name="dataFinal" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">Data Final</Form.Label>
                <Form.Control
                  type="date"
                  className="rounded px-2 py-1 outline outline-1 outline-cinza-600"
                  defaultValue={pesquisa.dataFinal}
                />
              </Form.Field> */}
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
            dados={dadosDaTabela ?? []}
            estaCarregando={isLoadingDadosDaTabela}
            ordenacaoPadrao={[{ id: "menu.id", desc: true }]}
          />
        </Secao>
      </Secao>
    </Secao>
  );
}

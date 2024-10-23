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
import { buscarRelatorioDeDesperdicio } from "@/app/actions/nutricionista";
import { IRelatorioDeDesperdicio } from "@/app/interfaces/IRelatorioDeDesperdicio";
import { ModalAdicionarRelatorioDeDesperdicio } from "@/app/elementos/modulos/nutricionista/RelatoriosDeDesperdicio/ModalAdicionarRelatorioDeDesperdicio";
import { ModalRemoverRelatorioDeDesperdicio } from "@/app/elementos/modulos/nutricionista/RelatoriosDeDesperdicio/ModalRemoverRelatorioDeDesperdicio";
import { ModalEditarRelatorioDeDesperdicio } from "@/app/elementos/modulos/nutricionista/RelatoriosDeDesperdicio/ModalEditarRelatorioDeDesperdicio";

export default function Page() {
  const [pesquisa, setPesquisa] = useQueryStates(
    {
      dataInicial: parseAsString.withDefault("2020-01-01"),
      dataFinal: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
    },
    {
      clearOnDefault: true,
    },
  );

  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: [
      "relatorioDeDesperdicio",
      pesquisa.dataInicial,
      pesquisa.dataFinal,
    ],
    queryFn: async () => {
      const resposta = await buscarRelatorioDeDesperdicio({
        data_inicial: pesquisa.dataInicial,
        data_final: pesquisa.dataFinal,
      });

      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: [],
  });

  const colunasHelper = createColumnHelper<IRelatorioDeDesperdicio>();

  const colunas = useMemo(
    () => [
      colunasHelper.accessor("id", {
        cell: (info) => info.getValue(),
        header: "ID",
        meta: { filterVariant: "range" },
      }),
      colunasHelper.accessor("menu.description", {
        cell: (info) => info.getValue(),
        header: "Cardápio",
        size: 750,
      }),
      colunasHelper.accessor("menu.meal.description", {
        cell: (info) => info.row.original.menu.meal.description,
        header: "Refeição",
      }),
      colunasHelper.accessor("total_food_waste", {
        cell: (info) => `${info.getValue()}kg`,
        header: "Rejeito total",
      }),
      colunasHelper.accessor("reject_per_person", {
        cell: (info) => `${info.getValue()}g`,
        header: "Rejeito por pessoa",
      }),
      colunasHelper.accessor("ingestion_percentage", {
        cell: (info) => `${info.getValue()}%`,
        header: "Porcentagem de resto",
      }),
      colunasHelper.accessor("waste_date", {
        cell: (info) =>
          DatasHelper.converterParaFormatoBrasileiro(info.getValue()),
        header: "Data",
      }),
      colunasHelper.accessor("people_fed", {
        cell: (info) => `${info.getValue()} pessoas`,
        header: "Poderia alimentar",
      }),
      colunasHelper.accessor("classification", {
        cell: (info) => info.getValue(),
        header: "Avaliação",
      }),
      colunasHelper.display({
        cell: (info) => (
          <div className="flex justify-center gap-x-2">
            <div className="relative h-5 w-5">
              <ModalRemoverRelatorioDeDesperdicio
                relatorio={info.row.original}
              />
            </div>
            <div className="relative h-5 w-5">
              <ModalEditarRelatorioDeDesperdicio
                relatorio={info.row.original}
              />
            </div>
          </div>
        ),
        header: "Ações",
      }),
    ],
    [colunasHelper],
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
        <CabecalhoDeSecao titulo="Relatório de desperdício" />
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
                  className="rounded px-2 py-1 outline outline-1 outline-cinza-600"
                  defaultValue={pesquisa.dataInicial}
                />
              </Form.Field>
              <Form.Field name="dataFinal" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">Data Final</Form.Label>
                <Form.Control
                  type="date"
                  className="rounded px-2 py-1 outline outline-1 outline-cinza-600"
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
          <div className="ml-auto mt-auto">
            <ModalAdicionarRelatorioDeDesperdicio />
          </div>
        </Secao>
        <Secao>
          <TabelaDeCrud
            colunas={colunas}
            dados={dadosDaTabela ?? []}
            estaCarregando={isLoadingDadosDaTabela}
          />
        </Secao>
      </Secao>
    </Secao>
  );
}

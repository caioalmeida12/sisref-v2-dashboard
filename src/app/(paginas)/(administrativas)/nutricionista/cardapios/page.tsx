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
import {
  buscarRefeicoes,
  buscarTabelaDeCardapios,
  criarCardapio,
  editarCardapio,
  removerCardapio,
} from "@/app/actions/nutricionista";
import { ModalGeral } from "@/app/elementos/modulos/comuns/ModalGeral/ModalGeral";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";

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
        cell: (props) =>
          props.row.original.meal.id && props.row.original.menu.id != 0 ? (
            <div className="flex justify-center gap-x-2">
              <ModalGeral
                textoTitulo="Remover cardápio"
                tipoDeBotaoPrincipal="remover"
                textoDescricao={[
                  "Tem certeza que deseja remover este cardápio?",
                ]}
                elementoDescricao={
                  <ul className="mt-2 list-disc pl-5">
                    <li>
                      ID: <strong>{props.row.original.meal.id}</strong>
                    </li>
                    <li>
                      Refeição:{" "}
                      <strong>{props.row.original.meal.description}</strong>
                    </li>
                    <li>
                      Cardápio:{" "}
                      <strong>{props.row.original.menu.description}</strong>
                    </li>
                    <li>
                      Data:{" "}
                      <strong>
                        {DatasHelper.converterParaFormatoBrasileiro(
                          props.row.original.menu.date,
                        )}
                      </strong>
                    </li>
                    <li>
                      ID do Menu: <strong>{props.row.original.menu.id}</strong>
                    </li>
                  </ul>
                }
                formulario={{
                  action: removerCardapio,
                  queryKeysParaInvalidar: [
                    ["refeicoes", props.row.original.menu.date],
                    ["tabelaDeCardapios"],
                  ],
                  substantivoParaMensagemDeRetorno: "cardápio",
                  campos: [
                    {
                      type: "hidden",
                      name: "menu_id",
                      value: props.row.original.menu.id,
                    },
                  ],
                }}
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent="Remover cardápio"
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Deletar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
              />
              <ModalGeral
                textoTitulo="Editar cardápio"
                tipoDeBotaoPrincipal="confirmar"
                textoDescricao={[
                  "Modifique o campo abaixo para editar o cardápio.",
                ]}
                formulario={{
                  action: editarCardapio,
                  queryKeysParaInvalidar: [
                    ["refeicoes", props.row.original.menu.date],
                    ["tabelaDeCardapios"],
                  ],
                  substantivoParaMensagemDeRetorno: "cardápio",
                  campos: [
                    {
                      type: "text",
                      label: "Descrição",
                      name: "description",
                      placeholder: "Ex: Pão com ovos + suco de acerola",
                      defaultValue: props.row.original.menu.description,
                    },
                    {
                      type: "hidden",
                      name: "date",
                      value: props.row.original.menu.date,
                    },
                    {
                      type: "hidden",
                      name: "meal_id",
                      value: props.row.original.meal.id,
                    },
                    {
                      type: "hidden",
                      value: props.row.original.menu.id,
                      name: "menu_id",
                    },
                  ],
                }}
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent="Editar cardápio"
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Editar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
              />
            </div>
          ) : (
            <div className="flex justify-center gap-x-2">
              <ModalGeral
                textoTitulo="Adicionar cardápio"
                tipoDeBotaoPrincipal="confirmar"
                textoDescricao={[
                  "Preencha o campo abaixo para adicionar o cardápio",
                ]}
                formulario={{
                  action: criarCardapio,
                  queryKeysParaInvalidar: [["tabelaDeCardapios"]],
                  substantivoParaMensagemDeRetorno: "cardápio",
                  campos: [
                    {
                      type: "text",
                      label: "Descrição",
                      name: "description",
                      placeholder: "ex: Pão com ovos; suco de goiaba",
                    },
                    {
                      type: "hidden",
                      name: "date",
                      value: pesquisa.dataInicial,
                    },
                    {
                      type: "hidden",
                      name: "meal_id",
                      value: props.row.original.meal.id,
                    },
                  ],
                }}
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent="Adicionar cardápio"
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Adicionar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
              />
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

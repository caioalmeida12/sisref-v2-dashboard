"use client";

import React, { useMemo } from "react";
import { parseAsString, useQueryStates } from "nuqs";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { Botao } from "@/app/elementos/basicos/Botao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Secao } from "@/app/elementos/basicos/Secao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import * as Form from "@radix-ui/react-form";
import { createColumnHelper } from "@tanstack/react-table";
import {
  buscarAgendamentos,
  confirmarAgendamento,
  removerAgendamento,
} from "@/app/actions/nutricionista";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/app/elementos/basicos/Badge";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";
import { ModalGeral } from "@/app/elementos/modulos/comuns/ModalGeral/ModalGeral";

export default function RecepcaoPage() {
  const [pesquisa, setPesquisa] = useQueryStates(
    {
      data: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
      codigoOuMatricula: parseAsString.withDefault(""),
    },
    {
      clearOnDefault: true,
    },
  );

  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ["tabelaDeAgendamentos", pesquisa.data],
    queryFn: async () => {
      const resposta = await buscarAgendamentos({
        data_inicial: pesquisa.data,
      });

      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: [],
  });

  const colunasHelper = createColumnHelper<(typeof dadosDaTabela)[number]>();

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
    const data = formData.get("data") as string;
    const codigoOuMatricula = formData.get("codigoOuMatricula") as string;

    setPesquisa({
      data,
      codigoOuMatricula,
    });
  };

  const handleReset = () => {
    setPesquisa({
      data: pesquisa.data,
      codigoOuMatricula: "",
    });
  };

  return (
    <Secao className="min-w-[768px] border-none">
      <Secao className="mx-auto flex max-w-[1440px] flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Confirmar refeições" />
        <Secao className="flex flex-wrap gap-y-2">
          <div className="flex items-end gap-x-4">
            <Form.Root
              className="flex items-end gap-x-2 gap-y-2"
              onSubmit={handleSubmit}
            >
              <Form.Field
                name="codigoOuMatricula"
                className="flex flex-col gap-y-2"
              >
                <Form.Label className="font-bold">
                  Código ou matrícula
                </Form.Label>
                <div className="flex gap-x-2">
                  <Form.Control
                    type="number"
                    className="rounded px-2 py-1 outline outline-1 outline-cinza-600"
                    placeholder="Ex: 2153"
                    defaultValue={
                      pesquisa.codigoOuMatricula.length
                        ? pesquisa.codigoOuMatricula
                        : undefined
                    }
                  />
                  <Form.Control type="reset" asChild>
                    <Botao
                      variante="remover"
                      texto="Limpar"
                      className="!border-none bg-vermelho-200 py-2 leading-tight !text-branco-400 !outline-preto-400"
                      onClick={handleReset}
                    />
                  </Form.Control>
                </div>
              </Form.Field>
              <Form.Field name="data" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">Data</Form.Label>
                <Form.Control
                  type="date"
                  className="rounded px-2 py-1 outline outline-1 outline-cinza-600"
                  defaultValue={pesquisa.data}
                />
              </Form.Field>
              <Botao
                variante="adicionar"
                texto="Buscar"
                className="py-2 leading-tight"
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
            ordenacaoPadrao={[
              {
                id: "codigoOuMatricula",
                desc: !(pesquisa.codigoOuMatricula.length > 0),
              },
            ]}
            filtros={[
              {
                id: "codigoOuMatricula",
                value: [pesquisa.codigoOuMatricula, pesquisa.codigoOuMatricula],
              },
            ]}
          />
        </Secao>
      </Secao>
    </Secao>
  );
}

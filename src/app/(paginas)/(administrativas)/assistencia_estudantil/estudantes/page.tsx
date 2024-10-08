"use client";

import React, { useMemo } from "react";
import { parseAsString, parseAsInteger, useQueryStates } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import * as Form from "@radix-ui/react-form";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Botao } from "@/app/elementos/basicos/Botao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { createColumnHelper } from "@tanstack/react-table";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import {
  buscarCursos,
  buscarEstudantes,
} from "@/app/actions/assistencia_estudantil";
import { ModalAdicionarEstudante } from "@/app/elementos/modulos/assistencia_estudantil/Estudantes/ModalAdicionarEstudante";
import { BadgeDeVencimento } from "@/app/elementos/basicos/BadgeDeVencimento";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import { IRespostaPaginada } from "@/app/interfaces/IRespostaPaginada";
import { TEstudanteComCursoTurnoEUsuario } from "@/app/interfaces/TEstudante";

export default function Estudantes() {
  const [pesquisa, setPesquisa] = useQueryStates(
    {
      dataInicial: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
      dataFinal: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
      page: parseAsInteger.withDefault(1),
      per_page: parseAsInteger.withDefault(10),
    },
    {
      clearOnDefault: true,
    },
  );

  const dadosPadrao = useMemo(
    () =>
      ({
        current_page: 1,
        data: [],
        first_page_url: "",
        from: 1,
        last_page: 1,
        last_page_url: "",
        links: [],
        next_page_url: "",
      }) satisfies IRespostaPaginada<TEstudanteComCursoTurnoEUsuario>,
    [],
  );

  const { data: dadosDaTabelaPaginados, isFetching: isLoadingDadosDaTabela } =
    useQuery({
      queryKey: ["buscarEstudantes"],
      queryFn: async () => {
        const resposta = await buscarEstudantes({
          pagina: pesquisa.page,
          por_pagina: pesquisa.per_page,
        });

        return resposta.sucesso ? resposta.resposta : [dadosPadrao];
      },
      initialData: [dadosPadrao],
    });

  const dadosDaTabela = useMemo(
    () => dadosDaTabelaPaginados[0].data,
    [dadosDaTabelaPaginados],
  );

  const colunasHelper = createColumnHelper<TEstudanteComCursoTurnoEUsuario>();

  const colunas = useMemo(
    () => [
      colunasHelper.accessor("id", {
        cell: (props) => props.getValue(),
        header: "ID",
        meta: { filterVariant: "range" },
      }),
      colunasHelper.accessor("mat", {
        cell: (props) => props.getValue(),
        header: "Matrícula",
      }),
      colunasHelper.accessor("name", {
        cell: (props) => props.getValue(),
        header: "Nome completo",
        size: 750,
      }),
      colunasHelper.accessor("user", {
        cell: (props) => props.getValue()[0] && props.getValue()[0].email,
        header: "Email",
      }),
      colunasHelper.accessor("course.description", {
        cell: (props) => (
          <CustomTooltipWrapper
            elementoContent={props.getValue()}
            elementoTrigger={props.row.original.course.initials}
          />
        ),
        header: "Curso",
      }),
      colunasHelper.accessor("shift", {
        cell: (props) => props.getValue()?.description ?? "",
        header: "Turno",
      }),
      colunasHelper.accessor("dateValid", {
        cell: (props) => <BadgeDeVencimento data={props.getValue()} />,
        header: "Vencimento",
      }),
      colunasHelper.accessor("observation", {
        cell: (props) => (
          <div className="line-clamp-1 hover:line-clamp-none">
            {props.getValue()}
          </div>
        ),
        header: "Observação",
      }),
    ],
    [],
  );

  return (
    <Secao className="min-w-[768px] border-none">
      <Secao className="mx-auto flex max-w-[1440px] flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Estudantes" />
        <Secao className="flex flex-wrap gap-y-2">
          <div className="ml-auto flex items-end gap-x-4">
            <ModalAdicionarEstudante />
          </div>
        </Secao>
        <Secao>
          <TabelaDeCrud
            colunas={colunas}
            dados={dadosDaTabela ?? []}
            estaCarregando={isLoadingDadosDaTabela}
            ordenacaoPadrao={[{ id: "id", desc: true }]}
            paginacaoNoServidor={{
              page: pesquisa.page,
              per_page: pesquisa.per_page,
              respostaPaginada: dadosDaTabelaPaginados[0],
            }}
          />
        </Secao>
      </Secao>
    </Secao>
  );
}

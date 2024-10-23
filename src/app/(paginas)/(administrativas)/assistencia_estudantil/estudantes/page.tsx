"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { createColumnHelper } from "@tanstack/react-table";
import {
  atualizarVencimentosEmMassa,
  buscarEstudantes,
} from "@/app/actions/assistencia_estudantil";
import { ModalAdicionarEstudante } from "@/app/elementos/modulos/assistencia_estudantil/Estudantes/ModalAdicionarEstudante";
import { BadgeDeVencimento } from "@/app/elementos/basicos/BadgeDeVencimento";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import { TEstudanteComCursoTurnoEUsuario } from "@/app/interfaces/TEstudante";
import { ModalEditarEstudante } from "@/app/elementos/modulos/assistencia_estudantil/Estudantes/ModalEditarEstudante";
import { ModalRemoverEstudante } from "@/app/elementos/modulos/assistencia_estudantil/Estudantes/ModalRemoverEstudante";
import { ModalGeral } from "@/app/elementos/modulos/comuns/ModalGeral/ModalGeral";
import { BotaoDiv } from "@/app/elementos/basicos/BotaoDiv";

export default function Estudantes() {
  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ["tabelaDeEstudantes"],
    queryFn: async () => {
      const resposta = await buscarEstudantes();

      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: [],
  });

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
      colunasHelper.accessor((student) => student.user[0]?.email ?? "", {
        cell: (props) => props.getValue(),
        header: "Email",
      }),
      colunasHelper.accessor(
        (student) =>
          `${student.course.initials} - ${student.course.description}`,
        {
          cell: (props) => (
            <CustomTooltipWrapper
              elementoContent={props.row.original.course.description}
              elementoTrigger={props.row.original.course.initials}
            />
          ),
          header: "Curso",
        },
      ),
      colunasHelper.accessor((student) => student.shift?.description ?? "", {
        cell: (props) => props.getValue(),
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
      colunasHelper.display({
        cell: (props) => {
          return (
            <div className="flex justify-center gap-x-2">
              <div className="relative h-5 w-5">
                <ModalRemoverEstudante estudante={props.row.original} />
              </div>
              <div className="relative h-5 w-5">
                <ModalEditarEstudante estudante={props.row.original} />
              </div>
            </div>
          );
        },
        enableResizing: false,
        header: "Ações",
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
            <ModalGeral
              elementoTrigger={
                <BotaoDiv
                  texto="Atualizar vencimentos"
                  variante="editar"
                  className="h-[36px] border-none px-10 py-2 leading-tight !text-branco-400 hover:!outline-preto-400 md:whitespace-nowrap"
                />
              }
              tipoDeBotaoPrincipal="confirmar"
              textoTitulo="Atualização em massa"
              textoDescricao={[
                "Atualize o vencimento de vários estudantes.",
                " Informe uma data futura válida e as iniciais da matrícula.",
              ]}
              formulario={{
                action: atualizarVencimentosEmMassa,
                substantivoParaMensagemDeRetorno: "atualização",
                queryKeysParaInvalidar: [["tabelaDeEstudantes"]],
                campos: [
                  {
                    type: "text",
                    name: "mat",
                    label: "Iniciais da matrícula",
                    placeholder: "ex: 20211",
                  },
                  {
                    type: "date",
                    name: "date",
                    label: "Nova data de vencimento",
                    placeholder: "01/01/2030",
                    min: "2021-12-12",
                    max: "2100-12-30",
                  },
                ],
              }}
            />
            <ModalAdicionarEstudante />
          </div>
        </Secao>
        <Secao>
          <TabelaDeCrud
            colunas={colunas}
            dados={dadosDaTabela ?? []}
            estaCarregando={isLoadingDadosDaTabela}
            ordenacaoPadrao={[{ id: "id", desc: true }]}
          />
        </Secao>
      </Secao>
    </Secao>
  );
}

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
import { ModalConfirmarAgendamento } from "@/app/elementos/modulos/nutricionista/Agendamentos/ModalConfirmarAgendamento";
import { ModalRemoverAgendamento } from "@/app/elementos/modulos/nutricionista/Agendamentos/ModalRemoverAgendamento";
import { ModalAdicionarAgendamento } from "@/app/elementos/modulos/nutricionista/Agendamentos/ModalAdicionarAgendamento";
import { buscarAgendamentos } from "@/app/actions/nutricionista";
import {
  buscarEstudantes,
  buscarJustificativasNaoProcessadas,
} from "@/app/actions/assistencia_estudantil";
import { ModalJustificativasNaoProcessadas } from "@/app/elementos/modulos/assistencia_estudantil/Agendamentos/ModalJustificativasNaoProcessadas";
import { ModalAdicionarJustificativa } from "@/app/elementos/modulos/assistencia_estudantil/Agendamentos/ModalAdicionarJustificativa";
import { Badge } from "@/app/elementos/basicos/Badge";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import { BadgeDeVencimento } from "@/app/elementos/basicos/BadgeDeVencimento";

export default function Estudantes() {
  const [pesquisa, setPesquisa] = useQueryStates(
    {
      dataInicial: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
      dataFinal: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
    },
    {
      clearOnDefault: true,
    },
  );

  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ["buscarEstudantes"],
    queryFn: async () => {
      const resposta = await buscarEstudantes();
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
        cell: (props) => props.getValue()[0].email,
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
      colunasHelper.accessor("shift.description", {
        cell: (props) => props.getValue(),
        header: "Turno",
      }),
      colunasHelper.accessor("dateValid", {
        cell: (props) => <BadgeDeVencimento data={props.getValue()} />,
        header: "Vencimento",
      }),
      colunasHelper.accessor("observation", {
        cell: (props) => props.getValue(),
        header: "Observação",
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
        <CabecalhoDeSecao titulo="Estudantes" />
        <Secao className="flex flex-wrap gap-y-2">
          <div className="flex items-end gap-x-4"></div>
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

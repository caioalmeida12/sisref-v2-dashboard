"use client";

import { buscarAgendamentos } from "@/app/actions/nutricionista";
import { Botao } from "@/app/elementos/basicos/Botao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Secao } from "@/app/elementos/basicos/Secao";
import { Badge } from "@elementos/basicos/Badge";
import { ModalConfirmarAgendamento } from "@/app/elementos/modulos/nutricionista/Agendamentos/ModalConfirmarAgendamento";
import { ModalRemoverAgendamento } from "@/app/elementos/modulos/nutricionista/Agendamentos/ModalRemoverAgendamento";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import * as Form from "@radix-ui/react-form";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import * as React from "react";
import { useMemo, useState } from "react";
import { ModalAdicionarAgendamento } from "@/app/elementos/modulos/nutricionista/Agendamentos/ModalAdicionarAgendamento";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { buscarJustificativasNaoProcessadas } from "@/app/actions/assistencia_estudantil";

export default function Agendamentos() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [datas, setDatas] = useState({
    dataInicial: searchParams.get("dataInicial") || DatasHelper.getDataDeHoje(),
    dataFinal: searchParams.get("dataFinal") || DatasHelper.getDataDeHoje(),
  });

  const { data: justificativasNaoProcessadas } = useQuery({
    queryKey: ["justificativasNaoProcessadas"],
    queryFn: async () => {
      const resposta = await buscarJustificativasNaoProcessadas();

      console.log(resposta);

      return resposta.sucesso ? resposta.resposta : [];
    },
    // staleTime: 1000 * 60 * 5,
    initialData: [],
  });

  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ["tabelaDeAgendamentos", datas.dataInicial, datas.dataFinal],
    queryFn: async () => {
      const resposta = await buscarAgendamentos({
        data_inicial: datas.dataInicial || new Date().toISOString(),
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
              <ModalRemoverAgendamento agendamento={props.row.original} />
            </div>
            {!props.row.original.wasPresent && (
              <div className="relative h-5 w-5">
                <ModalConfirmarAgendamento agendamento={props.row.original} />
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

    const urlAtual = new URL(window.location.href);
    urlAtual.searchParams.set("dataInicial", dataInicial);
    urlAtual.searchParams.set("dataFinal", dataFinal);

    setDatas({ dataInicial, dataFinal });
    router.push(urlAtual.toString());
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
                <Form.Label className="font-bold">Data Inicial</Form.Label>
                <Form.Control
                  type="date"
                  className="rounded px-2 py-1 outline outline-1 outline-cinza-600"
                  defaultValue={datas.dataInicial}
                />
              </Form.Field>
              <Form.Submit />
              <Form.Field name="dataFinal" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">Data Final</Form.Label>
                <Form.Control
                  type="date"
                  className="rounded px-2 py-1 outline outline-1 outline-cinza-600"
                  defaultValue={datas.dataFinal}
                />
              </Form.Field>
              <Form.Submit />
              <Botao
                variante="adicionar"
                texto="Buscar"
                className="py-2 leading-tight"
                type="submit"
              />
            </Form.Root>
          </div>
          <div className="ml-auto mt-auto">
            <ModalAdicionarAgendamento />
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

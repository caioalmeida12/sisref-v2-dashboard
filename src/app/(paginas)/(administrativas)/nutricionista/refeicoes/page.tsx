"use client"

import React, { useRef, useState, useMemo } from "react";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Botao } from "@/app/elementos/basicos/Botao";
import * as Form from '@radix-ui/react-form';
import { useQuery } from "@tanstack/react-query";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { createColumnHelper } from "@tanstack/react-table";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { ModalAdicionarRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalAdicionarRefeicao";
import { ModalRemoverRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalRemoverRefeicao";
import { ModalEditarRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalEditarRefeicao";
import { buscarRefeicoes } from "@/app/actions/nutricionista";

export default function NutricionistaPage() {
  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ['tabelaDeRefeicoes'],
    queryFn: async () => {
      const resposta = await buscarRefeicoes();

      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: []
  });

  const colunasHelper = createColumnHelper<typeof dadosDaTabela[number]>();

  const colunas = useMemo(() => [
    colunasHelper.accessor("id", {
      cell: props => <p>{props.getValue()}</p>,
      header: 'ID',
    }),
    colunasHelper.accessor('description', {
      cell: props => <div className="whitespace-nowrap">{props.getValue()}</div>,
      header: 'Nome',
    }),
    colunasHelper.accessor('timeStart', {
      cell: props => props.getValue(),
      header: 'Início da refeição',
    }),
    colunasHelper.accessor('timeEnd', {
      cell: props => props.getValue(),
      header: 'Fim da refeição',
    }),
    colunasHelper.accessor('qtdTimeReservationStart', {
      cell: props => props.row.original?.timeStart ? DatasHelper.aplicarHorasEmFormatoBrasileiro(props.row.original?.timeStart, -props.row.original.qtdTimeReservationStart || 0) : 'Não informado',
      header: 'Início das reservas',
    }),
    colunasHelper.accessor('qtdTimeReservationEnd', {
      cell: props => props.row.original?.timeEnd ? DatasHelper.aplicarHorasEmFormatoBrasileiro(props.row.original?.timeEnd, -props.row.original.qtdTimeReservationEnd || 0) : 'Não informado',
      header: 'Fim das reservas',
    }),
    colunasHelper.display({
      cell: props => (
        <div className="flex justify-center gap-x-2">
          <div className="w-5 h-5 relative">
            <ModalRemoverRefeicao refeicao={props.row.original} />
          </div>
          <div className="w-5 h-5 relative">
            <ModalEditarRefeicao refeicao={props.row.original} />
          </div>
        </div>
      ),
      enableResizing: false,
      header: 'Ações',
    })
  ], []);

  return (
    <Secao className="border-none">
      <Secao className="max-w-[1440px] mx-auto flex flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Refeições" />
        <Secao className="flex flex-wrap gap-y-2">
          <div className='ml-auto mt-auto'>
            <ModalAdicionarRefeicao />
          </div>
        </Secao>
        <Secao>
          <TabelaDeCrud colunas={colunas} dados={dadosDaTabela} estaCarregando={isLoadingDadosDaTabela} />
        </Secao>
      </Secao>
    </Secao>
  );
}
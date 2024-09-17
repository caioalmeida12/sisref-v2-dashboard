"use client"

import React, { useMemo } from "react";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { useQuery } from "@tanstack/react-query";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { buscarRefeicoes } from "@/app/actions/nutricionista";
import { ModalRemoverRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalRemoverRefeicao";
import { ModalAdicionarRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalAdicionarRefeicao";
import { ModalEditarRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalEditarRefeicao";
import { TRefeicao } from "@/app/interfaces/TRefeicao";

export default function NutricionistaPage() {
  const { data: dadosDaTabela, isLoading: isLoadingDadosDaTabela } = useQuery({
    queryKey: ['tabelaDeRefeicoes'],
    queryFn: async () => {
      const resposta = await buscarRefeicoes()

      return resposta.sucesso ? resposta.resposta : []
    },
    initialData: []
  });

  const colunasHelper = createColumnHelper<TRefeicao>();

  const colunas = useMemo(() => [
    colunasHelper.accessor('id', {
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
    <>
      <Secao className="border-none">
        <Secao className="max-w-[1440px] mx-auto flex flex-col gap-y-4">
          <CabecalhoDeSecao titulo="Refeições" />
          <Secao className="flex">
            <div className='ml-auto mt-auto'>
              <ModalAdicionarRefeicao />
            </div>
          </Secao>
          <Secao>
            {
              isLoadingDadosDaTabela &&
              <div className="flex justify-center items-center h-40">
                <span>Carregando...</span>
              </div>
            }
            {
              !isLoadingDadosDaTabela &&
              dadosDaTabela &&
              <TabelaDeCrud colunas={colunas} dados={dadosDaTabela} />
            }
          </Secao>
        </Secao>
      </Secao>
    </>
  );
}
"use client"

import React from "react";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { useQuery } from "@tanstack/react-query";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { ColumnDef } from "@tanstack/react-table";
import { IRefeicao } from "@/app/elementos/interfaces/IRefeicao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { buscarRefeicoes } from "@/app/actions/nutricionista";
import { ModalRemoverRefeição } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalRemoverRefeicao";
import { ModalAdicionarRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalAdicionarRefeicao";

export default function NutricionistaPage() {
  const { data: dadosDaTabela, isLoading: isLoadingDadosDaTabela, refetch } = useQuery({
    queryKey: ['tabelaDeRefeicoes'],
    queryFn: async () => {
      const resposta = await buscarRefeicoes()

      return resposta.sucesso ? resposta.resposta : []
    },
    initialData: []
  });

  const colunas = React.useMemo<ColumnDef<IRefeicao["refeicao"]>[]>(
    () => [
      {
        accessorKey: 'ID',
        accessorFn: (row) => row?.id,
        cell: info => info.getValue(),
        meta: {
          filterVariant: "range"
        }
      }, {
        accessorKey: 'Nome',
        accessorFn: (row) => row?.description,
        cell: info => info.getValue(),
      }, {
        accessorKey: 'Início da refeição',
        accessorFn: (row) => row?.timeStart,
        cell: info => info.getValue(),
      }, {
        accessorKey: 'Fim da refeição',
        accessorFn: (row) => row?.timeEnd,
        cell: info => info.getValue(),
      }, {
        accessorKey: 'Horário para início das reservas',
        accessorFn: (row) => row?.qtdTimeReservationStart,
        cell: info => info.row.original?.timeStart ? DatasHelper.aplicarHorasEmFormatoBrasileiro(info.row.original?.timeStart, -info.row.original.qtdTimeReservationStart || 0) : 'Não informado',
      }, {
        accessorKey: 'Horário para fim das reservas',
        accessorFn: (row) => row?.qtdTimeReservationEnd,
        cell: info => info.row.original?.timeEnd ? DatasHelper.aplicarHorasEmFormatoBrasileiro(info.row.original?.timeEnd, -info.row.original.qtdTimeReservationEnd || 0) : 'Não informado',
      },
      {
        header: 'Ações',
        id: 'Ações',
        cell: info => (
          <div className="flex justify-center gap-x-2">
            <div className="w-5 h-5 relative">
              <ModalRemoverRefeição refeicao={info.row.original!} />
            </div>
            <div className="w-5 h-5 relative">
              {/* <ModalEditarCardapio refeicao={info.row.original} /> */}
            </div>
          </div>)
      }
    ],
    []
  )

  return (
    <>
      <Secao className="border-none">
        <Secao className="max-w-[1440px] mx-auto flex flex-col gap-y-4">
          <CabecalhoDeSecao titulo="Cardápios" />
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
              <TabelaDeCrud colunas={colunas} dados={dadosDaTabela} refetch={refetch} />
            }
          </Secao>
        </Secao>
      </Secao>
    </>
  );
}
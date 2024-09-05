"use client"

import React, { useRef } from "react";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { useQuery } from "@tanstack/react-query";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { ColumnDef } from "@tanstack/react-table";
import { IRefeicao } from "@/app/elementos/interfaces/IRefeicao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { buscarRelatorioDeDesperdicio } from "@/app/actions/nutricionista";
import { ModalRemoverRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalRemoverRefeicao";
import { ModalAdicionarRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalAdicionarRefeicao";
import { ModalEditarRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalEditarRefeicao";
import * as Form from "@radix-ui/react-form";
import { Botao } from "@/app/elementos/basicos/Botao";
import { pegarStatusDaRefeicao } from "@/app/lib/elementos/Refeicao";
import { StatusDaRefeicao } from "@/app/elementos/basicos/StatusDaRefeicao";
import { ValueOf } from "next/dist/shared/lib/constants";
import { IRelatorioDeDesperdicio } from "@/app/elementos/interfaces/IRelatorioDeDesperdicio";

export default function NutricionistaPage() {
  const dataInicialRef = useRef<HTMLInputElement>(null);
  const dataFinalRef = useRef<HTMLInputElement>(null);

  const { data: dadosDaTabela, isLoading: isLoadingDadosDaTabela, refetch } = useQuery({
    queryKey: ['relatorioDeRefeicoes', dataInicialRef.current?.value, dataFinalRef.current?.value],
    queryFn: async () => {
      const resposta = await buscarRelatorioDeDesperdicio({ data_inicial: dataInicialRef.current?.value, data_final: dataFinalRef.current?.value });

      return resposta.sucesso ? resposta.resposta : []
    },
    initialData: []
  });

  const colunas = React.useMemo<ColumnDef<IRelatorioDeDesperdicio>[]>(
    () => [
      {
        accessorKey: 'ID',
        accessorFn: (row) => row?.id,
        cell: info => info.getValue()
      }, {
        accessorKey: 'Refeição',
        accessorFn: (row) => row?.menu?.description,
        cell: info => info.getValue()
      }, {
        accessorKey: 'Rejeito total',
        accessorFn: (row) => row?.total_food_waste,
        cell: info => info.getValue()
      }, {
        accessorKey: 'Rejeito por pessoa',
        accessorFn: (row) => row?.reject_per_person,
        cell: info => info.getValue()
      }, {
        accessorKey: 'Porcentagem de resto',
        accessorFn: (row) => row?.ingestion_percentage,
        cell: info => info.getValue()
      }, {
        accessorKey: 'Data',
        accessorFn: (row) => row?.waste_date,
        cell: info => info.getValue()
      }, {
        accessorKey: 'Poderia alimentar',
        accessorFn: (row) => row?.people_fed,
        cell: info => info.getValue()
      }, {
        accessorKey: 'Avaliação',
        accessorFn: (row) => row?.classification,
        cell: info => info.getValue()
      }
    ],
    []
  )

  return (
    <>
      <Secao className="border-none">
        <Secao className="max-w-[1440px] mx-auto flex flex-col gap-y-4">
          <CabecalhoDeSecao titulo="Relatório de desperdício" />
          <Secao className="flex">
            <div className="flex gap-x-4 items-end">
              <Form.Root className="flex">
                <Form.Field name="dataInicial" className="flex flex-col gap-y-2" >
                  <Form.Label className="font-bold">
                    Data Inicial
                  </Form.Label>
                  <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={DatasHelper.getDataDeHoje()} ref={dataInicialRef} />
                </Form.Field>
                <Form.Submit />
              </Form.Root>
              <Form.Root className="flex">
                <Form.Field name="dataInicial" className="flex flex-col gap-y-2" >
                  <Form.Label className="font-bold">
                    Data Final
                  </Form.Label>
                  <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={DatasHelper.getDataDeHoje()} ref={dataFinalRef} />
                </Form.Field>
                <Form.Submit />
              </Form.Root>
              <Botao variante="adicionar" texto="Buscar" className="h-[36px] py-0 px-10" onClick={() => refetch()} />
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
              < TabelaDeCrud colunas={colunas} dados={dadosDaTabela} refetch={refetch} />
            }
          </Secao>
        </Secao>
      </Secao>
    </>
  );
}
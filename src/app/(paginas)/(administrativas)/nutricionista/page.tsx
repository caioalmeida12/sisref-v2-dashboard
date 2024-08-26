"use client"

import React, { useRef, useState } from "react";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Botao } from "@/app/elementos/basicos/Botao";
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { fetchTabelaDeRefeicoesNutricionista } from "@/app/actions/fetchTabelaDeRefeicoesRefeicoes";
import { fetchNomesDeRefeicoesNutricionista } from "@/app/actions/fetchNomesDeRefeicoesNutricionista";
import { TabelaDeCrud } from "@/app/elementos/modulos/TabelaDeCrud/TabelaDeCrud";
import { ColumnDef } from "@tanstack/react-table";
import { IRefeicao } from "@/app/elementos/interfaces/IRefeicao";
import { Badge } from "@/app/elementos/basicos/Badge";
import Icone from "@/app/elementos/basicos/Icone";
interface NutricionistaPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function NutricionistaPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
  searchParams
}: NutricionistaPageProps) {
  // As datas são armazenadas no formato  yyyy-MM-dd
  const [datas, setDatas] = useState<{ dataInicial: string, dataFinal: string }>({
    dataInicial: new Date().toISOString().split('T')[0],
    dataFinal: new Date().toISOString().split('T')[0]
  });

  const dataInicialRef = useRef<HTMLInputElement>(null);
  const dataFinalRef = useRef<HTMLInputElement>(null);
  const nomeDeRefeicaoRef = useRef<HTMLFormElement>(null);

  const { data: nomesDasRefeicoes, isLoading: isLoadingRefeicoes } = useQuery({
    queryKey: ['refeicoes', datas],
    queryFn: () => fetchNomesDeRefeicoesNutricionista(),
    initialData: []
  });

  const { data: dadosDaTabela, isLoading: isLoadingDadosDaTabela, refetch: refetchDadosDaTabela } = useQuery({
    queryKey: ['tabela', datas, nomeDeRefeicaoRef.current?.querySelector('select')?.value, nomesDasRefeicoes],
    queryFn: () => fetchTabelaDeRefeicoesNutricionista({ campus_id: 1, date: datas.dataInicial, refeicoes_disponiveis: nomesDasRefeicoes?.filter(refeicao => refeicao?.id) || [] }),
    initialData: []
  });

  const handleBuscar = () => {
    const dataInicial = dataInicialRef.current?.querySelector('input')?.value;
    const dataFinal = dataFinalRef.current?.querySelector('input')?.value;
    const nomeDeRefeicao = nomeDeRefeicaoRef.current?.querySelector('select')?.value;

    console.log(dataInicial, dataFinal, nomeDeRefeicao);

    setDatas({
      dataInicial: dataInicial || datas.dataInicial,
      dataFinal: dataFinal || datas.dataFinal
    });
  };

  const colunas = React.useMemo<ColumnDef<IRefeicao, any>[]>(
    () => [
      {
        accessorKey: 'refeicao.id',
        accessorFn: (row) => row.refeicao?.id,
        cell: info => info.getValue(),
        meta: {
          filterVariant: "range"
        }
      }, {
        accessorKey: 'refeicao.date',
        accessorFn: (row) => row.cardapio?.date,
        cell: info => info.getValue(),
      }, {
        accessorKey: 'refeicao.description',
        accessorFn: (row) => row.refeicao?.description,
        cell: info => info.getValue(),
        meta: {
          filterVariant: "text"
        }
      }, {
        accessorKey: 'cardapio.description',
        accessorFn: (row) => row.cardapio?.description,
        cell: info => info.getValue(),
      }, {
        header: 'Ações',
        id: 'Ações',
        cell: info => (
          // Refeições não cadastradas retornam id = 0
          info.row.original.cardapio?.id != undefined && info.row.original.cardapio.id > 0 ? (<div className="flex justify-center gap-x-2">
            <button className="w-5 h-5 relative">
              <Icone.Deletar className="absolute inset-0 block w-full h-full" />
            </button>
            <button className="w-5 h-5 relative">
              <Icone.Editar className="absolute inset-0 block w-full h-full" />
            </button>
          </div>) : (
            <div className="flex justify-center gap-x-2">
              <button className="w-5 h-5 relative">
                <Icone.Adicionar className="absolute inset-0 block w-full h-full" />
              </button>
            </div>
          )
        )
      }
    ],
    []
  )

  return (
    <>
      <Secao className="border-none">
        <Secao className="max-w-[1440px] mx-auto flex flex-col gap-y-4">
          <CabecalhoDeSecao titulo="Refeições" />
          <Secao className="flex">
            <div className="flex gap-x-4 items-end">
              <Form.Root className="flex">
                <Form.Field name="dataInicial" className="flex flex-col gap-y-2" ref={dataInicialRef}>
                  <Form.Label className="font-bold">
                    Data Inicial
                  </Form.Label>
                  <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={datas.dataInicial} />
                </Form.Field>
                <Form.Submit />
              </Form.Root>
              <Form.Root className="flex">
                <Form.Field name="dataInicial" className="flex flex-col gap-y-2" ref={dataFinalRef}>
                  <Form.Label className="font-bold">
                    Data Final
                  </Form.Label>
                  <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={datas.dataFinal} />
                </Form.Field>
                <Form.Submit />
              </Form.Root>
              <Botao variante="adicionar" texto="Buscar" className="h-[36px] py-0 px-10" onClick={handleBuscar} />
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
              <TabelaDeCrud colunas={colunas} dados={dadosDaTabela} refetch={refetchDadosDaTabela} />
            }
          </Secao>
        </Secao>
      </Secao>
    </>
  );
}
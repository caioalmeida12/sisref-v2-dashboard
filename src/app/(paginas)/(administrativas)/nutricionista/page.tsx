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
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { IRefeicao } from "@/app/elementos/interfaces/IRefeicao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { Badge } from "@/app/elementos/basicos/Badge";

interface NutricionistaPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const colunasHelper = createColumnHelper<IRefeicao>()
const colunas = [
  colunasHelper.accessor('refeicao', {
    cell: info => info.getValue()?.id,
    header: () => <Badge texto="Id" corDaBadge="bg-preto-400" className="border-none" />,
  }),
  colunasHelper.accessor('cardapio', {
    cell: info => info.getValue()?.date ? DatasHelper.converterParaFormatoBrasileiro(info.getValue()!.date) : 'Data não informada',
    header: () => <Badge texto="Data" corDaBadge="bg-preto-400" className="border-none" />,
  }),
  colunasHelper.accessor('refeicao', {
    cell: info => info.getValue()?.description,
    header: () => <Badge texto="Nome da Refeição" corDaBadge="bg-preto-400" className="border-none" />,
  }),
  colunasHelper.accessor('cardapio', {
    cell: info => info.getValue()?.description,
    header: () => <Badge texto="Descrição" corDaBadge="bg-preto-400" className="border-none" />,
  }),
  colunasHelper.display({
    id: 'Ações',
    header: () => <Badge texto="Ações" corDaBadge="bg-preto-400" className="border-none" />,
    cell: info => (
      <div className="flex justify-center gap-x-2">
        <Botao variante="editar" texto="Editar" className="h-[36px] py-0 px-10" />
        <Botao variante="remover" texto="Remover" className="h-[36px] py-0 px-10" />
      </div>
    ),
  })
]

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

  const { data: refeicoes, isLoading: isLoadingRefeicoes } = useQuery({
    queryKey: ['refeicoes', datas],
    queryFn: () => fetchNomesDeRefeicoesNutricionista()
  });

  const { data: dadosDaTabela, isLoading: isLoadingDadosDaTabela } = useQuery({
    queryKey: ['tabela', datas, nomeDeRefeicaoRef.current?.querySelector('select')?.value],
    queryFn: () => fetchTabelaDeRefeicoesNutricionista({ campus_id: 1, date: datas.dataInicial }),
  });

  const tabela = useReactTable({
    data: dadosDaTabela || [],
    columns: colunas,
    getCoreRowModel: getCoreRowModel(),
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
              <div className="flex flex-col gap-y-2">
                <label className="font-bold">Refeição</label>
                <form ref={nomeDeRefeicaoRef}>
                  <Select.Root>
                    <Select.Trigger className="px-2 py-1 h-[34px] flex overflow-hidden items-center min-w-[250px] text-left rounded outline outline-1 outline-cinza-600">
                      <Select.Value placeholder="Todas as refeições" defaultValue={"0"} />
                      <Select.Icon className="SelectIcon">
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content>
                        <Select.ScrollUpButton />
                        <Select.Viewport className="bg-branco-400 px-2 py-1 rounded outline outline-1 outline-cinza-600">
                          <Select.Item value={"0"} className="flex items-center px-2 py-1 hover:outline outline-1 rounded hover:bg-amarelo-200">
                            <Select.ItemText>
                              Todas as refeições
                            </Select.ItemText>
                            <Select.ItemIndicator>
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                          {
                            !isLoadingRefeicoes && refeicoes &&
                            refeicoes.map((refeicao, index) => (
                              <Select.Item value={String(refeicao?.id)} className="flex items-center px-2 py-1 hover:outline outline-1 rounded hover:bg-amarelo-200" key={index}>
                                <Select.ItemText>
                                  {refeicao?.description}
                                </Select.ItemText>
                                <Select.ItemIndicator>
                                  <CheckIcon />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))
                          }
                        </Select.Viewport>
                        <Select.ScrollDownButton />
                        <Select.Arrow />
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </form>
              </div>
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
              !isLoadingDadosDaTabela && dadosDaTabela &&
              <table className="w-full text-center">
                <thead>
                  {tabela.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {tabela.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {tabela.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map(header => (
                        <th key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.footer,
                              header.getContext()
                            )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </tfoot>
              </table>
            }
          </Secao>
        </Secao>
      </Secao>
    </>
  );
}
"use client"

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from 'next/navigation';
import * as Form from '@radix-ui/react-form';

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Botao } from "@/app/elementos/basicos/Botao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { createColumnHelper } from "@tanstack/react-table";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { ModalAdicionarCardapio } from "@/app/elementos/modulos/nutricionista/Cardapios/ModalAdicionarCardapio";
import { ModalRemoverCardapio } from "@/app/elementos/modulos/nutricionista/Cardapios/ModalRemoverCardapio";
import { ModalEditarCardapio } from "@/app/elementos/modulos/nutricionista/Cardapios/ModalEditarCardapio";
import { buscarRefeicoes, buscarTabelaDeCardapios } from "@/app/actions/nutricionista";

export default function NutricionistaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [datas, setDatas] = useState({
    dataInicial: searchParams.get('dataInicial') || DatasHelper.getDataDeHoje(),
    dataFinal: searchParams.get('dataFinal') || DatasHelper.getDataDeHoje()
  });

  const { data: refeicoesDisponiveis } = useQuery({
    queryKey: ['refeicoes', datas],
    queryFn: async () => {
      const resposta = await buscarRefeicoes();
      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: []
  });

  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ['tabelaDeCardapios', datas, refeicoesDisponiveis],
    queryFn: async () => {
      const resposta = await buscarTabelaDeCardapios({ campus_id: 1, data: datas.dataInicial, refeicoes_disponiveis: refeicoesDisponiveis });
      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: []
  });

  const colunasHelper = createColumnHelper<typeof dadosDaTabela[number]>();

  const colunas = useMemo(() => [
    colunasHelper.accessor('menu.id', {
      cell: info => info.getValue(),
      header: 'ID',
      meta: { filterVariant: 'range' }
    }),
    colunasHelper.accessor('menu.date', {
      cell: info => info.getValue() && DatasHelper.converterParaFormatoBrasileiro(`${info.getValue()}`) || 'Não informado',
      header: 'Data',
    }),
    colunasHelper.accessor('meal.description', {
      cell: info => info.getValue(),
      header: 'Refeição',
      meta: { filterVariant: "text" }
    }),
    colunasHelper.accessor('menu.description', {
      cell: info => info.getValue(),
      header: 'Cardápio',
    }),
    colunasHelper.display({
      cell: info => (
        info.row.original.meal.id && info.row.original.menu.id != 0 ? (
          <div className="flex justify-center gap-x-2">
            <div className="w-5 h-5 relative">
              <ModalRemoverCardapio refeicao_e_cardapio={info.row.original} />
            </div>
            <div className="w-5 h-5 relative">
              <ModalEditarCardapio refeicao_e_cardapio={info.row.original} />
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-x-2">
            <ModalAdicionarCardapio refeicao_e_cardapio={info.row.original} />
          </div>
        )
      ),
      header: 'Ações',
    })
  ], []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const dataInicial = formData.get('dataInicial') as string;
    const dataFinal = formData.get('dataFinal') as string;

    const urlAtual = new URL(window.location.href);
    urlAtual.searchParams.set('dataInicial', dataInicial);
    urlAtual.searchParams.set('dataFinal', dataFinal);

    setDatas({ dataInicial, dataFinal });
    router.push(urlAtual.toString());
  };

  return (
    <Secao className="border-none min-w-[768px]">
      <Secao className="max-w-[1440px] mx-auto flex flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Cardápios" />
        <Secao className="flex flex-wrap gap-y-2">
          <div className="flex gap-x-4 items-end">
            <Form.Root className="flex gap-x-2 items-end gap-y-2" onSubmit={handleSubmit}>
              <Form.Field name="dataInicial" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">
                  Data Inicial
                </Form.Label>
                <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={datas.dataInicial} />
              </Form.Field>
              <Form.Submit />
              <Form.Field name="dataFinal" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">
                  Data Final
                </Form.Label>
                <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={datas.dataFinal} />
              </Form.Field>
              <Form.Submit />
              <Botao variante="adicionar" texto="Buscar" className="h-[36px] px-10 leading-tight py-2" type='submit' />
            </Form.Root>
          </div>
        </Secao>
        <Secao>
          <TabelaDeCrud colunas={colunas} dados={dadosDaTabela ?? []} estaCarregando={isLoadingDadosDaTabela} ordenacaoPadrao={[{ id: 'menu.id', desc: true }]} />
        </Secao>
      </Secao>
    </Secao>
  );
}
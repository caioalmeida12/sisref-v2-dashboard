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
import { buscarRelatorioDeDesperdicio } from "@/app/actions/nutricionista";
import { IRelatorioDeDesperdicio } from "@/app/interfaces/IRelatorioDeDesperdicio";

export default function NutricionistaPage() {
  const [datas, setDatas] = useState<{ dataInicial: string, dataFinal: string }>({
    dataInicial: new Date().toISOString().split('T')[0],
    dataFinal: new Date().toISOString().split('T')[0]
  });

  const dataInicialRef = useRef<HTMLInputElement>(null);
  const dataFinalRef = useRef<HTMLInputElement>(null);

  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela, refetch } = useQuery({
    queryKey: ['relatorioDeRefeicoes', datas],
    queryFn: async () => {
      const resposta = await buscarRelatorioDeDesperdicio({ data_inicial: datas.dataInicial, data_final: datas.dataFinal });

      return resposta.sucesso ? resposta.resposta : []
    },
    initialData: []
  });

  const handleBuscar = () => {
    const dataInicial = dataInicialRef.current?.value;
    const dataFinal = dataFinalRef.current?.value;

    setDatas({
      dataInicial: dataInicial || datas.dataInicial,
      dataFinal: dataFinal || datas.dataFinal
    });

    refetch();
  };

  const colunasHelper = createColumnHelper<IRelatorioDeDesperdicio>();

  const colunas = useMemo(() => [
    colunasHelper.accessor('id', {
      cell: info => info.getValue(),
      header: 'ID',
    }),
    colunasHelper.accessor('menu.description', {
      cell: info => info.getValue(),
      header: 'Refeição',
    }),
    colunasHelper.accessor('total_food_waste', {
      cell: info => info.getValue(),
      header: 'Rejeito total',
    }),
    colunasHelper.accessor('reject_per_person', {
      cell: info => info.getValue(),
      header: 'Rejeito por pessoa',
    }),
    colunasHelper.accessor('ingestion_percentage', {
      cell: info => info.getValue(),
      header: 'Porcentagem de resto',
    }),
    colunasHelper.accessor('waste_date', {
      cell: info => info.getValue(),
      header: 'Data',
    }),
    colunasHelper.accessor('people_fed', {
      cell: info => info.getValue(),
      header: 'Poderia alimentar',
    }),
    colunasHelper.accessor('classification', {
      cell: info => info.getValue(),
      header: 'Avaliação',
    })
  ], []);

  return (
    <Secao className="border-none">
      <Secao className="max-w-[1440px] mx-auto flex flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Relatório de desperdício" />
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
              <Form.Field name="dataFinal" className="flex flex-col gap-y-2" ref={dataFinalRef}>
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
          <TabelaDeCrud colunas={colunas} dados={dadosDaTabela ?? []} estaCarregando={isLoadingDadosDaTabela} />
        </Secao>
      </Secao>
    </Secao>
  );
}
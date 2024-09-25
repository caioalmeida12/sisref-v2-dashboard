'use client'

import React, { useMemo } from "react";
import { parseAsString, useQueryStates } from 'nuqs';
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { Botao } from "@/app/elementos/basicos/Botao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Secao } from "@/app/elementos/basicos/Secao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import * as Form from '@radix-ui/react-form';
import { createColumnHelper } from "@tanstack/react-table";
import { buscarRelatorioDeDesperdicio } from "@/app/actions/nutricionista";
import { useQuery } from "@tanstack/react-query";
import { IRelatorioDeDesperdicio } from "@/app/interfaces/IRelatorioDeDesperdicio";

export default function RecepcaoPage() {
  const [pesquisa, setPesquisa] = useQueryStates({
    dataInicial: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
    dataFinal: parseAsString.withDefault(DatasHelper.getDataDeHoje())
  }, {
    clearOnDefault: true,
  });

  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ['relatorioDeDesperdicio', pesquisa.dataInicial, pesquisa.dataFinal],
    queryFn: async () => {
      const resposta = await buscarRelatorioDeDesperdicio({ data_inicial: pesquisa.dataInicial, data_final: pesquisa.dataFinal });

      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: []
  });

  const colunasHelper = createColumnHelper<IRelatorioDeDesperdicio>();

  const colunas = useMemo(() => [
    colunasHelper.accessor('id', {
      cell: info => info.getValue(),
      header: 'ID',
      meta: { filterVariant: 'range' }
    }),
    colunasHelper.accessor('menu.description', {
      cell: info => info.getValue(),
      header: 'Refeição',
      size: 750
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const dataInicial = formData.get('dataInicial') as string;
    const dataFinal = formData.get('dataFinal') as string;

    setPesquisa({
      dataInicial,
      dataFinal
    });
  }

  return (
    <Secao className="border-none min-w-[768px]">
      <Secao className="max-w-[1440px] mx-auto flex flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Relatório de desperdício" />
        <Secao className="flex flex-wrap gap-y-2">
          <div className="flex gap-x-4 items-end">
            <Form.Root className="flex gap-x-2 items-end gap-y-2" onSubmit={handleSubmit}>
              <Form.Field name="dataInicial" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">
                  Data Inicial
                </Form.Label>
                <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={pesquisa.dataInicial} />
              </Form.Field>
              <Form.Field name="dataFinal" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">
                  Data Final
                </Form.Label>
                <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={pesquisa.dataFinal} />
              </Form.Field>
              <Botao variante="adicionar" texto="Buscar" className="h-[36px] px-10 leading-tight py-2" type='submit' />
            </Form.Root>
          </div>
        </Secao>
        <Secao>
          <TabelaDeCrud colunas={colunas} dados={dadosDaTabela ?? []} estaCarregando={isLoadingDadosDaTabela} />
        </Secao>
      </Secao>
    </Secao>
  );
}
"use client"

import React, { useRef } from "react";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { useQuery } from "@tanstack/react-query";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { ColumnDef } from "@tanstack/react-table";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { buscarRelatorioDeRefeicoes } from "@/app/actions/nutricionista";
import * as Form from "@radix-ui/react-form";
import { Botao } from "@/app/elementos/basicos/Botao";
import { StatusDaRefeicao } from "@/app/elementos/basicos/StatusDaRefeicao";
import { IRelatorioDeRefeicoes } from "@/app/elementos/interfaces/IRelatorioDeRefeicoes";

export default function NutricionistaPage() {
  const dataInicialRef = useRef<HTMLInputElement>(null);
  const dataFinalRef = useRef<HTMLInputElement>(null);

  const { data: dadosDaTabela, isLoading: isLoadingDadosDaTabela, refetch } = useQuery({
    queryKey: ['relatorioDeRefeicoes', dataInicialRef.current?.value, dataFinalRef.current?.value],
    queryFn: async () => {
      const resposta = await buscarRelatorioDeRefeicoes({ data_inicial: dataInicialRef.current?.value, data_final: dataFinalRef.current?.value });

      return resposta.sucesso ? resposta.resposta : []
    },
    initialData: []
  });

  const pegarStatusDaRefeicao = (refeicao: IRelatorioDeRefeicoes): { tipo: string, elemento: React.ReactNode } => {
    if (refeicao.wasPresent) return {
      tipo: "Utilizado",
      elemento: <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Utilizado" textoTooltip="A refeição foi reservada e o ticket já foi utilizado." />
    }

    if (refeicao.canceled_by_student) return {
      tipo: "Cancelado",
      elemento: <StatusDaRefeicao cor="vermelho-400" icone="tag-x" texto="Cancelado" textoTooltip="Esta reserva foi cancelada." />
    }

    if (refeicao.absenceJustification) return {
      tipo: "Justificado",
      elemento: <StatusDaRefeicao cor="azul-400" icone="circulo-check" texto="Justificado" textoTooltip={`A ausência a esta refeição foi justificada. Justificativa: ${refeicao.studentJustification}`} />
    }

    if (!refeicao.absenceJustification) return {
      tipo: "Ausente",
      elemento: <StatusDaRefeicao cor="vermelho-400" icone="circulo-x" texto="Ausente" textoTooltip="A pessoa reservou mas não esteve presente nesta refeição. É necessário justificar a ausência." />
    }

    return {
      tipo: "Disponível",
      elemento: <StatusDaRefeicao cor="amarelo-200" icone="circulo-check" texto="Disponível" textoTooltip="A refeição foi reservada e o ticket ainda pode ser utilizado." />
    }
  }

  const colunas = React.useMemo<ColumnDef<IRelatorioDeRefeicoes>[]>(
    () => [
      {
        accessorKey: 'ID',
        accessorFn: (row) => row?.id,
        cell: info => info.getValue()
      }, {
        accessorKey: 'Estudante',
        accessorFn: (row) => row?.name,
        cell: info => info.getValue(),
      }, {
        accessorKey: 'Refeição',
        accessorFn: (row) => row?.meal_description,
        cell: info => info.getValue(),
      }, {
        accessorKey: 'Data',
        accessorFn: (row) => row?.date,
        cell: info => info.getValue(),
      }, {
        accessorKey: 'Curso',
        accessorFn: (row) => row?.initials,
        cell: info => info.getValue(),
      }, {
        accessorKey: 'Situação',
        accessorFn: (row) => pegarStatusDaRefeicao(row).tipo,
        cell: info => pegarStatusDaRefeicao(info.row.original).elemento,
      }
    ],
    []
  )

  return (
    <>
      <Secao className="border-none">
        <Secao className="max-w-[1440px] mx-auto flex flex-col gap-y-4">
          <CabecalhoDeSecao titulo="Reflatório de refeições" />
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
"use client"

import React, { useRef } from "react";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { useQuery } from "@tanstack/react-query";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { ColumnDef } from "@tanstack/react-table";
import { IRefeicao } from "@/app/elementos/interfaces/IRefeicao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { buscarRelatorioDeRefeicoes } from "@/app/actions/nutricionista";
import { ModalRemoverRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalRemoverRefeicao";
import { ModalAdicionarRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalAdicionarRefeicao";
import { ModalEditarRefeicao } from "@/app/elementos/modulos/nutricionista/Refeicoes/ModalEditarRefeicao";
import * as Form from "@radix-ui/react-form";
import { Botao } from "@/app/elementos/basicos/Botao";
import { pegarStatusDaRefeicao } from "@/app/lib/elementos/Refeicao";
import { StatusDaRefeicao } from "@/app/elementos/basicos/StatusDaRefeicao";

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

  dadosDaTabela && console.log(dadosDaTabela);

  // Colunas: código (id), estudante (nome), refeição (nome), cardápio (nome), data, curso (iniciais), situação

  const elementoStatusRefeicaoPorTextoStatusRefeicao = {
    "a-ser-utilizado": <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Reservado" textoTooltip="O ticket ainda pode ser utilizado." />,
    "nao-utilizado": <StatusDaRefeicao cor="amarelo-200" icone="circulo-check" texto="Disponível" textoTooltip="A refeição foi reservada e o ticket ainda pode ser utilizado." />,
    "justificado": <StatusDaRefeicao cor="azul-400" icone="circulo-check" texto="Justificado" textoTooltip="A ausência a esta refeição foi justificada." />,
    "cancelado": <StatusDaRefeicao cor="vermelho-400" icone="tag-x" texto="Cancelado" textoTooltip="Esta reserva foi cancelada." />,
    "utilizado": <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Utilizado" textoTooltip="A refeição foi reservada e o ticket já foi utilizado." />,
    "nao-utilizado-sem-justificativa": <StatusDaRefeicao cor="vermelho-400" icone="circulo-x" texto="Não justificado" textoTooltip="A pessoa não esteve presente nesta refeição. É necessário justificar a ausência." />
  } as const;


  const colunas = React.useMemo<ColumnDef<IRelatorioDeRefeicoes>[]>(
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
        accessorKey: 'Refeição',
        accessorFn: (row) => row?.meal_description,
        cell: info => info.getValue(),
      }, {
        accessorKey: 'Cardápio',
        accessorFn: (row) => row?.name,
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
        accessorFn: (row) => row?.active,
        cell: info => {
          if (info.row.original.wasPresent) return elementoStatusRefeicaoPorTextoStatusRefeicao["utilizado"];
          if (info.row.original.canceled_by_student) return elementoStatusRefeicaoPorTextoStatusRefeicao["cancelado"];
          if (info.row.original.absenceJustification) return elementoStatusRefeicaoPorTextoStatusRefeicao["justificado"];
          if (!info.row.original.absenceJustification) return elementoStatusRefeicaoPorTextoStatusRefeicao["nao-utilizado-sem-justificativa"];
          return elementoStatusRefeicaoPorTextoStatusRefeicao["nao-utilizado"];
        }
      },
      {
        header: 'Ações',
        id: 'Ações',
        cell: info => (
          <div className="flex justify-center gap-x-2">
            <div className="w-5 h-5 relative">
              {/* <ModalRemoverRefeicao refeicao={info.row.original!} /> */}
            </div>
            <div className="w-5 h-5 relative">
              {/* <ModalEditarRefeicao refeicao={info.row.original} /> */}
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
          <CabecalhoDeSecao titulo="Refeições" />
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
              < TabelaDeCrud colunas={colunas} dados={dadosDaTabela} refetch={refetch} />
            }
          </Secao>
        </Secao>
      </Secao>
    </>
  );
}
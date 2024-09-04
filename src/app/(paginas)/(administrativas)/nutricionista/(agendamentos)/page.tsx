"use client"

import { buscarAgendamentos } from '@/app/actions/nutricionista';
import { Botao } from '@/app/elementos/basicos/Botao';
import { CabecalhoDeSecao } from '@/app/elementos/basicos/CabecalhoDeSecao';
import { Secao } from '@/app/elementos/basicos/Secao';
import { IAgendamento } from '@/app/elementos/interfaces/IAgendamento';
import { Badge } from "@elementos/basicos/Badge";
import { ModalConfirmarAgendamento } from '@/app/elementos/modulos/Agendamentos/ModalConfirmarAgendamento';
import { ModalRemoverAgendamento } from '@/app/elementos/modulos/Agendamentos/ModalRemoverAgendamento';
import { TabelaDeCrud } from '@/app/elementos/modulos/TabelaDeCrud/TabelaDeCrud';
import { DatasHelper } from '@/app/lib/elementos/DatasHelper';
import * as Form from '@radix-ui/react-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { useRef, useState } from 'react';
import { ModalAdicionarCardapio } from '@/app/elementos/modulos/Cardapios/ModalAdicionarCardapio';
import { ModalAdicionarAgendamento } from '@/app/elementos/modulos/Agendamentos/ModalAdicionarAgendamento';

export default function Agendamentos() {
    const dataInicialRef = useRef<HTMLInputElement>(null);
    const dataFinalRef = useRef<HTMLInputElement>(null);

    const { data: dadosDaTabela, refetch, isLoading } = useQuery({
        queryKey: ['tabelaDeAgendamentos', dataInicialRef.current?.value, dataFinalRef.current?.value],
        queryFn: async () => {
            const resposta = await buscarAgendamentos({ data_inicial: dataInicialRef.current?.value || new Date().toISOString() });

            return resposta.sucesso ? resposta.resposta : [];
        },
        initialData: []
    });

    const colunas = React.useMemo<ColumnDef<IAgendamento, any>[]>(() => [
        {
            accessorKey: 'ID',
            accessorFn: (row) => row.id,
            cell: info => <div className="flex flex-col justify-center items-center gap-4">{info.getValue()}</div>,
            meta: {
                filterVariant: "range"
            },
        },
        {
            accessorKey: 'Refeição',
            accessorFn: (row) => row.meal.description,
            cell: info => <div className="flex flex-col justify-center items-start gap-4">{info.getValue()}</div>,
        },
        {
            accessorKey: 'Estudante',
            accessorFn: (row) => row.student.name,
            cell: info => <div className="flex flex-col justify-center items-center gap-4 flex-[1,0,0]">{info.getValue()}</div>,
        },
        {
            accessorKey: 'Cardápio',
            accessorFn: (row) => row.menu.description,
            cell: info => <div className="flex flex-col justify-center items-start gap-4 flex-[1,0,0]">{info.getValue()}</div>,
        },
        {
            accessorKey: 'Vencimento',
            accessorFn: (row) => row.student.dateValid,
            cell: info => <div className="flex flex-col justify-center items-center gap-4">
                <Badge texto={info.getValue()} corDaBadge="bg-verde-300" />
            </div>,
        },
        {
            accessorKey: 'Curso',
            accessorFn: (row) => row.student.course.initials,
            cell: info => <div className="flex flex-col justify-center items-center gap-4">{info.getValue()}</div>,
        }, {
            header: 'Ações',
            id: 'Ações',
            accessorFn: (row) => row,
            cell: info => (
                <div className="flex justify-center gap-x-2">
                    <div className="w-5 h-5 relative">
                        <ModalRemoverAgendamento agendamento={info.getValue()} />
                    </div>
                    <div className="w-5 h-5 relative">
                        <ModalConfirmarAgendamento agendamento={info.getValue()} />
                    </div>
                </div>
            )
        }
    ], []);

    return (
        <Secao className="border-none">
            <Secao className="max-w-[1440px] mx-auto flex flex-col gap-y-4">
                <CabecalhoDeSecao titulo="Agendamentos" />
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
                    <ModalAdicionarAgendamento />
                </Secao>
                <Secao>
                    <TabelaDeCrud colunas={colunas} dados={dadosDaTabela ?? []} refetch={refetch} />
                </Secao>
            </Secao>
        </Secao>
    );
}
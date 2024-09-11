"use client"

import { buscarAgendamentos } from '@/app/actions/nutricionista';
import { Botao } from '@/app/elementos/basicos/Botao';
import { CabecalhoDeSecao } from '@/app/elementos/basicos/CabecalhoDeSecao';
import { Secao } from '@/app/elementos/basicos/Secao';
import { Badge } from "@elementos/basicos/Badge";
import { ModalConfirmarAgendamento } from '@/app/elementos/modulos/nutricionista/Agendamentos/ModalConfirmarAgendamento';
import { ModalRemoverAgendamento } from '@/app/elementos/modulos/nutricionista/Agendamentos/ModalRemoverAgendamento';
import { TabelaDeCrud } from '@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud';
import { DatasHelper } from '@/app/lib/elementos/DatasHelper';
import * as Form from '@radix-ui/react-form';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import * as React from 'react';
import { useRef } from 'react';
import { ModalAdicionarAgendamento } from '@/app/elementos/modulos/nutricionista/Agendamentos/ModalAdicionarAgendamento';
import { TAgendamento } from '@/app/interfaces/TAgendamento';

export default function Agendamentos() {
    const dataInicialRef = useRef<HTMLInputElement>(null);
    const dataFinalRef = useRef<HTMLInputElement>(null);

    const { data: dadosDaTabela, refetch } = useQuery({
        queryKey: ['tabelaDeAgendamentos', dataInicialRef.current?.value, dataFinalRef.current?.value],
        queryFn: async () => {
            const resposta = await buscarAgendamentos({ data_inicial: dataInicialRef.current?.value || new Date().toISOString() });

            return resposta.sucesso ? resposta.resposta : [];
        },
        initialData: []
    });

    const colunasHelper = createColumnHelper<TAgendamento>();

    const colunas = React.useMemo(() => [
        colunasHelper.accessor('id', {
            cell: props => props.getValue(),
            header: 'ID',
            enableResizing: false,
            size: 80,
        }),
        colunasHelper.accessor('meal.description', {
            cell: props => props.getValue(),
            header: 'Refeição',
            maxSize: 175,
        }),
        colunasHelper.accessor('student.name', {
            cell: props => props.getValue(),
            header: 'Estudante',
            size: 400
        }),
        colunasHelper.accessor('menu.description', {
            cell: props => props.getValue(),
            header: 'Cardápio',
        }),
        colunasHelper.accessor('menu.date', {
            cell: props => props.getValue(),
            header: 'Data',
            maxSize: 100
        }),
        colunasHelper.accessor('student.dateValid', {
            cell: props => <Badge texto={props.getValue()} corDaBadge="bg-verde-300" />,
            header: 'Vencimento',
            maxSize: 130
        }),
        colunasHelper.accessor('student.course.initials', {
            cell: props => props.getValue(),
            header: 'Curso',
            maxSize: 80
        }),
        colunasHelper.display({
            cell: props => (
                <div className="flex justify-center gap-x-2">
                    <div className="w-5 h-5 relative">
                        <ModalRemoverAgendamento agendamento={props.row.original} />
                    </div>
                    {
                        !(props.row.original.wasPresent) && (
                            <div className="w-5 h-5 relative">
                                <ModalConfirmarAgendamento agendamento={props.row.original} />
                            </div>
                        )
                    }
                </div>
            ),
            size: 75,
            enableResizing: false,
            header: 'Ações',
        })
    ], [])

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
                    <div className='ml-auto mt-auto'>
                        <ModalAdicionarAgendamento />
                    </div>
                </Secao>
                <Secao>
                    <TabelaDeCrud colunas={colunas} dados={dadosDaTabela ?? []} refetch={refetch} />
                </Secao>
            </Secao>
        </Secao>
    );
}
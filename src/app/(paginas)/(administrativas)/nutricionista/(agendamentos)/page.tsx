'use client'

import React, { useMemo } from "react";
import { parseAsString, useQueryStates } from 'nuqs'
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { Botao } from "@/app/elementos/basicos/Botao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Secao } from "@/app/elementos/basicos/Secao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import * as Form from '@radix-ui/react-form';
import { createColumnHelper } from "@tanstack/react-table";
import { buscarAgendamentos } from "@/app/actions/nutricionista";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/app/elementos/basicos/Badge";
import { ModalConfirmarAgendamento } from "@/app/elementos/modulos/nutricionista/Agendamentos/ModalConfirmarAgendamento";
import { BadgeDeVencimento } from "@/app/elementos/basicos/BadgeDeVencimento";

export default function Agendamentos() {
    const [pesquisa, setPesquisa] = useQueryStates({
        dataInicial: parseAsString.withDefault(DatasHelper.getDataDeHoje()),
        dataFinal: parseAsString.withDefault(DatasHelper.getDataDeHoje())
    }, {
        clearOnDefault: true,
    });

    const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
        queryKey: ['tabelaDeAgendamentos', pesquisa.dataInicial, pesquisa.dataFinal],
        queryFn: async () => {
            const resposta = await buscarAgendamentos({ data_inicial: pesquisa.dataInicial });

            return resposta.sucesso ? resposta.resposta : [];
        },
        initialData: []
    });

    const colunasHelper = createColumnHelper<typeof dadosDaTabela[number]>();

    const colunas = useMemo(() => [
        colunasHelper.accessor('id', {
            cell: props => props.getValue(),
            header: 'ID',
            meta: { filterVariant: 'range' }
        }),
        colunasHelper.accessor('meal.description', {
            cell: props => <div className="whitespace-nowrap">{props.getValue()}</div>,
            header: 'Refeição',
        }),
        colunasHelper.accessor('student.name', {
            cell: props => <p className='text-left'>{props.getValue()}</p>,
            header: 'Estudante',
            size: 750
        }),
        colunasHelper.accessor('menu.description', {
            cell: props => <div className="line-clamp-1 hover:line-clamp-none">{props.getValue()}</div>,
            header: 'Cardápio',
            size: 1000
        }),
        colunasHelper.accessor('menu.date', {
            cell: props => DatasHelper.converterParaFormatoBrasileiro(props.getValue()),
            header: 'Data',
        }),
        colunasHelper.accessor('student.dateValid', {
            cell: props => <BadgeDeVencimento data={props.getValue()} />,
            header: 'Vencimento',
        }),
        colunasHelper.accessor('student.course.initials', {
            cell: props => props.getValue(),
            header: 'Curso',
        }),
        colunasHelper.display({
            cell: props => (
                <div className="flex justify-center gap-x-2">
                    <div className="w-5 h-5 relative">
                        <ModalConfirmarAgendamento agendamento={props.row.original} />
                    </div>
                </div>
            ),
            enableResizing: false,
            header: 'Ações',
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
                <CabecalhoDeSecao titulo="Agendamentos" />
                <Secao className="flex flex-wrap gap-y-2">
                    <div className="flex gap-x-4 items-end">
                        <Form.Root className="flex gap-x-2 items-end gap-y-2" onSubmit={handleSubmit}>
                            <Form.Field name="dataInicial" className="flex flex-col gap-y-2" >
                                <Form.Label className="font-bold">
                                    Data Inicial
                                </Form.Label>
                                <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={pesquisa.dataInicial} />
                            </Form.Field>
                            <Form.Field name="dataFinal" className="flex flex-col gap-y-2" >
                                <Form.Label className="font-bold">
                                    Data Final
                                </Form.Label>
                                <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={pesquisa.dataFinal} />
                            </Form.Field>
                            <Botao variante="adicionar" texto="Buscar" className='leading-tight py-2' type='submit' />
                        </Form.Root>
                    </div>
                </Secao>
                <Secao>
                    <TabelaDeCrud
                        colunas={colunas}
                        dados={dadosDaTabela ?? []}
                        estaCarregando={isLoadingDadosDaTabela}
                        ordenacaoPadrao={[{ id: 'id', desc: true }]}
                    />
                </Secao>
            </Secao>
        </Secao>
    );
}
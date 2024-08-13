"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { DatasHelper } from '@/app/lib/elementos/DatasHelper';
import { Botao } from '../../basicos/Botao';
import { Cross2Icon } from '@radix-ui/react-icons';
import EditorDeTexto from './EditorDeTexto';
import { criarRelatorioDeDesperdicio } from '@/app/actions/criarRelatorioDeDesperdicio';

const BotaoDeAbrir = () => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <Botao variante='adicionar' texto='Adicionar Relatorio' />
        </Dialog.Trigger>
        <CorpoDoModal />
    </Dialog.Root>
);

const CorpoDoModal = () => {
    const [data, setData] = useState({
        startDate: new Date(DatasHelper.getDataPosterior(new Date().toISOString().split('T')[0])),
        endDate: new Date(DatasHelper.getDataPosterior(new Date().toISOString().split('T')[0])),
    });

    const [html, setHtml] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [salvando, setSalvando] = useState(false);

    const mensagemDeResposta = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // fetchRefeicoesParaCardapio().then((refeicoes) => setRefeicoes(refeicoes));
    }, [data]);

    const handleDataChange = (novaData: DateValueType) => {
        if (!novaData?.startDate || !novaData?.endDate) return;

        const corrigirData = (dateStr: string) => {
            const ontem = new Date(dateStr).toISOString().split('T')[0];
            const hoje = DatasHelper.getDataPosterior(ontem);
            return new Date(hoje);
        };

        const startDate = typeof novaData.startDate === 'string' ? corrigirData(novaData.startDate) : novaData.startDate;
        const endDate = typeof novaData.endDate === 'string' ? corrigirData(novaData.endDate) : novaData.endDate;

        setData({ startDate, endDate });
    };

    const handleSalvar = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSalvando(true);

        // Atualiza a mensagem para mostrar "Salvando..." enquanto a operação está em andamento
        mensagemDeResposta.current!.textContent = 'Salvando...';
        mensagemDeResposta.current!.classList.remove('hidden', 'text-verde-400', 'text-vermelho-400');
        mensagemDeResposta.current!.classList.add('text-azul-400');

        const formData = new FormData();
        formData.append('date', data.startDate.toISOString().split('T')[0]);
        formData.append('content', html);

        const { sucesso, mensagem } = await criarRelatorioDeDesperdicio(formData);

        setSalvando(false);

        if (sucesso) {
            mensagemDeResposta.current!.classList.add('text-verde-400');
        } else {
            mensagemDeResposta.current!.classList.add('text-vermelho-400');
        }

        mensagemDeResposta.current!.textContent = mensagem;

        setSalvando(false);
    };

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="bg-preto-400/25 data-[state=open]:animate-overlayShow fixed inset-0 " />
            <Dialog.Content className="flex flex-col gap-y-4 overflow-y-auto data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] min-h-[600px] max-h-[85vh] w-[90vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none ">
                <Dialog.Title className="m-0 font-medium text-lg">
                    Adicionar Relatório de Desperdício
                </Dialog.Title>
                <Dialog.Description className="leading-normal">
                    Preencha os a data e escreva novo relatório de desperdício.
                </Dialog.Description>
                <div>
                    <label className='font-bold' htmlFor='data'>
                        Data do relatório
                    </label>
                    <div className='outline outline-1 rounded mt-2'>
                        <Datepicker
                            primaryColor='red'
                            value={data}
                            onChange={(novaData) => handleDataChange(novaData)}
                            asSingle={true}
                            useRange={false}
                            placeholder='AAAA-MM-DD'
                            displayFormat='DD/MM/YYYY'
                            i18n='pt-br'
                        />
                    </div>
                </div>
                <EditorDeTexto setHtml={setHtml} />
                <div ref={mensagemDeResposta} className="hidden" />
                <Botao variante='adicionar' texto='Salvar' onClick={handleSalvar} />
                <Dialog.Close asChild>
                    <button
                        name='Fechar'
                        className="hover:bg-cinza-400 focus:shadow-cinza-400 absolute top-2 right-2 inline-flex p-[0.25em] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                        aria-label="Fechar"
                    >
                        <Cross2Icon />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    )
};

export const ModalAdicionarRelatorioDeDesperdicio = () => { }

ModalAdicionarRelatorioDeDesperdicio.BotaoDeAbrir = BotaoDeAbrir;
ModalAdicionarRelatorioDeDesperdicio.CorpoDoModal = CorpoDoModal;

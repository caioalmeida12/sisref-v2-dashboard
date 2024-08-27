"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { DatasHelper } from '@/app/lib/elementos/DatasHelper';
import SelectRefeicao from '../../componentes/SelectRefeicao';
import { Botao } from '../../basicos/Botao';
import { Cross2Icon } from '@radix-ui/react-icons';
// import { criarRefeicao } from '@/app/actions/criarRefeicao';
import { IRefeicao } from '../../interfaces/IRefeicao';
import Icone from '../../basicos/Icone';
import { criarRefeição } from '@/app/actions/criarRefeicao';

export const ModalAdicionarRefeicao = () => {
    const [data, setData] = useState({
        startDate: new Date(DatasHelper.getDataPosterior(new Date().toISOString().split('T')[0])),
        endDate: new Date(DatasHelper.getDataPosterior(new Date().toISOString().split('T')[0])),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [refeicoes, setRefeicoes] = useState<IRefeicao["refeicao"][]>([]);
    const [salvando, setSalvando] = useState(false);

    const mensagemDeResposta = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // fetchRefeicoesParaRefeicao().then((refeicoes) => setRefeicoes(refeicoes));
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

    const handleSalvar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSalvando(true);

        // Atualiza a mensagem para mostrar "Salvando..." enquanto a operação está em andamento
        mensagemDeResposta.current!.textContent = 'Salvando...';
        mensagemDeResposta.current!.classList.remove('hidden', 'text-verde-400', 'text-vermelho-400');
        mensagemDeResposta.current!.classList.add('text-azul-400');

        const formData = new FormData(e.currentTarget);

        const { sucesso, mensagem } = await criarRefeição(formData);

        setSalvando(false);

        if (sucesso) {
            mensagemDeResposta.current!.classList.add('text-verde-400');
        } else {
            mensagemDeResposta.current!.classList.add('text-vermelho-400');
        }

        mensagemDeResposta.current!.textContent = mensagem;
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Icone.Adicionar />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-preto-400/25 data-[state=open]:animate-overlayShow fixed inset-0 " />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none ">
                    <Dialog.Title className="m-0 font-medium text-lg">
                        Adicionar refeição
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 mb-5 leading-normal">
                        Preencha os campos abaixo para adicionar uma nova refeição.
                    </Dialog.Description>
                    <form className='flex flex-col gap-y-4' onSubmit={handleSalvar}>
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="description">
                                Descrição
                            </label>
                            <input
                                className="shadow-preto-400 focus:shadow-preto-400 inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-4 py-2 leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                id="description"
                                placeholder='Ex: Pão com ovos + suco de acerola'
                            />
                        </fieldset>
                        <fieldset className='flex flex-col gap-y-2 justify-start' >
                            <label className='font-medium' htmlFor="date">
                                Data
                            </label>
                            <div className='outline outline-1 rounded'>
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
                        </fieldset>
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="meal">
                                Refeição
                            </label>
                            <SelectRefeicao refeicoes={refeicoes} />
                        </fieldset>
                        <div className="flex justify-end flex-col items-center gap-y-2">
                            <div className="text-center" ref={mensagemDeResposta}></div>
                            <Botao texto='Salvar' variante='adicionar' type='submit' className='mt-4' disabled={salvando} />
                        </div>
                        <Dialog.Close asChild>
                            <button
                                name='Fechar'
                                className="hover:bg-cinza-400 focus:shadow-cinza-400 absolute top-2 right-2 inline-flex p-[0.25em] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                                aria-label="Fechar"
                            >
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
};
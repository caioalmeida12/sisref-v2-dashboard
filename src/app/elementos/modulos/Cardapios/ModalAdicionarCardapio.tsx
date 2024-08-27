"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { DatasHelper } from '@/app/lib/elementos/DatasHelper';
import { Botao } from '../../basicos/Botao';
import { CheckIcon, ChevronDownIcon, Cross2Icon } from '@radix-ui/react-icons';
import { criarCardapio } from '@/app/actions/criarCardapio';
import { IRefeicao } from '../../interfaces/IRefeicao';
import Icone from '../../basicos/Icone';
import { fetchNomesDeRefeicoesNutricionista } from '@/app/actions/fetchNomesDeRefeicoesNutricionista';
import * as Select from '@radix-ui/react-select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useMensagemDeResposta from '@/app/lib/elementos/UseMensagemDeResposta';

export const ModalAdicionarCardapio = () => {
    const { atualizarMensagem, mensagemDeRespostaRef } = useMensagemDeResposta();

    const queryClient = useQueryClient();

    const [datas, setDatas] = useState({
        startDate: new Date(DatasHelper.getDataPosterior(new Date().toISOString().split('T')[0])),
        endDate: new Date(DatasHelper.getDataPosterior(new Date().toISOString().split('T')[0])),
    });

    const { data: nomesDasRefeicoes, isLoading: isLoadingRefeicoes } = useQuery({
        queryKey: ['refeicoes', datas],
        queryFn: () => fetchNomesDeRefeicoesNutricionista()
    });

    const { mutate: handleSalvar, isPending } = useMutation({
        mutationFn: (formData: FormData) => criarCardapio(formData),
        mutationKey: ['criarCardapio', datas],
        onMutate: () => {
            atualizarMensagem({ mensagem: 'Salvando cardápio...' });
        },
        onSuccess: (json) => {
            // Devido a um erro na API, o JSON de erro é retornado com status 200. Esse comportamento foi descrito em criarCardapio.ts:49
            if (!json.sucesso) return atualizarMensagem(json);

            atualizarMensagem({ mensagem: 'Cardápio salvo com sucesso!', sucesso: true });

            queryClient.invalidateQueries({
                queryKey: ['refeicoes', datas],
            })

            queryClient.invalidateQueries({
                queryKey: ['tabelaDeCardapios'],
            })
        },
        onError: (error) => {
            atualizarMensagem({ mensagem: error.message, sucesso: false });
        },
    })

    const handleDataChange = (novaData: { startDate?: string, endDate?: string }) => {
        if (!novaData?.startDate || !novaData?.endDate) return;

        const corrigirData = (dateStr: string) => {
            const ontem = new Date(dateStr).toISOString().split('T')[0];
            const hoje = DatasHelper.getDataPosterior(ontem);
            return new Date(hoje);
        };

        const startDate = typeof novaData.startDate === 'string' ? corrigirData(novaData.startDate) : novaData.startDate;
        const endDate = typeof novaData.endDate === 'string' ? corrigirData(novaData.endDate) : novaData.endDate;

        setDatas({ startDate, endDate });
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
                        Adicionar cardápio
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 mb-5 leading-normal">
                        Preencha os campos abaixo para adicionar um novo cardápio.
                    </Dialog.Description>
                    <form className='flex flex-col gap-y-4' action={handleSalvar}>
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="description">
                                Descrição
                            </label>
                            <input
                                className="shadow-preto-400 focus:shadow-preto-400 inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-4 py-2 leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                id="description"
                                placeholder='Ex: Pão com ovos + suco de acerola'
                                name='description'
                            />
                        </fieldset>
                        <fieldset className='flex flex-col gap-y-2 justify-start' >
                            <label className='font-medium' htmlFor="date">
                                Data
                            </label>
                            <div className='outline outline-1 rounded'>
                                <input type='date' id='date' name='date' className='px-2 py-1 w-full' onChange={(e) => handleDataChange({ startDate: e.target.value, endDate: e.target.value })} />
                            </div>
                        </fieldset>
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="meal">
                                Refeição
                            </label>
                            <Select.Root name='meal_id'>
                                <Select.Trigger className="px-2 py-1 h-[34px] flex overflow-hidden items-center min-w-[250px] text-left rounded outline outline-1 outline-cinza-600">
                                    <Select.Value placeholder="Selecione a refeição" />
                                    <Select.Icon className="SelectIcon">
                                        <ChevronDownIcon />
                                    </Select.Icon>
                                </Select.Trigger>

                                <Select.Portal>
                                    <Select.Content>
                                        <Select.ScrollUpButton />
                                        <Select.Viewport className="bg-branco-400 px-2 py-1 rounded outline outline-1 outline-cinza-600">
                                            {
                                                !isLoadingRefeicoes && nomesDasRefeicoes &&
                                                nomesDasRefeicoes.map((refeicao, index) => (
                                                    <Select.Item value={String(refeicao?.id)} className="flex items-center px-2 py-1 hover:outline outline-1 rounded hover:bg-amarelo-200" key={index}>
                                                        <Select.ItemText>
                                                            {refeicao?.description}
                                                        </Select.ItemText>
                                                        <Select.ItemIndicator>
                                                            <CheckIcon />
                                                        </Select.ItemIndicator>
                                                    </Select.Item>
                                                ))
                                            }
                                        </Select.Viewport>
                                        <Select.ScrollDownButton />
                                        <Select.Arrow />
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </fieldset>
                        <div className="flex justify-end flex-col items-center gap-y-2">
                            <div className="text-center" ref={mensagemDeRespostaRef}></div>
                            <Botao texto='Salvar' variante='adicionar' type='submit' className='mt-4' disabled={isPending} />
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
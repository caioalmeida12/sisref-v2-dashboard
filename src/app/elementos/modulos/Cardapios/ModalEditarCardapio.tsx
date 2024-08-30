"use client"
import React, { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckIcon, ChevronDownIcon, Cross2Icon } from '@radix-ui/react-icons';
import Icone from '../../basicos/Icone';
import useMensagemDeResposta from '@/app/lib/elementos/UseMensagemDeResposta';
import { Botao } from '../../basicos/Botao';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IRefeicao } from '../../interfaces/IRefeicao';
import * as Select from '@radix-ui/react-select';
import { DatasHelper } from '@/app/lib/elementos/DatasHelper';
import { buscarRefeicoes, editarCardapio } from '@/app/actions/nutricionista';

interface ModalProps {
    refeicao: IRefeicao;
}

export const ModalEditarCardapio: React.FC<ModalProps> = ({ refeicao }) => {
    const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
    const queryClient = useQueryClient();

    const [data, setData] = useState(new Date(DatasHelper.getDataPosterior(new Date().toISOString().split('T')[0])));

    const [modalAberto, setModalAberto] = useState(false);

    const { mutate: handleEditar, isPending } = useMutation({
        mutationFn: (formData: FormData) => editarCardapio(formData),
        mutationKey: ['editarCardapio', data],
        onMutate: () => {
            atualizarMensagem({ mensagem: 'Salvando cardápio...' });
        },
        onSuccess: (json) => {
            if (!json.sucesso) return atualizarMensagem(json);

            atualizarMensagem({ mensagem: 'Cardápio salvo com sucesso!', sucesso: true });

            setTimeout(() => {
                setModalAberto(false);

                queryClient.invalidateQueries({
                    queryKey: ['refeicoes', data],
                })

                queryClient.invalidateQueries({
                    queryKey: ['tabelaDeCardapios'],
                })
            }, 500);
        },
        onError: (error) => {
            atualizarMensagem({ mensagem: error.message, sucesso: false });
        },
    })

    const handleDataChange = (novaData: string) => {
        const corrigirData = (dateStr: string) => {
            const ontem = new Date(dateStr).toISOString().split('T')[0];
            const hoje = DatasHelper.getDataPosterior(ontem);
            return new Date(hoje);
        };

        const dataCorrigida = typeof novaData === 'string' ? corrigirData(novaData) : novaData;

        setData(dataCorrigida);
    };

    return (
        <Dialog.Root open={modalAberto}>
            <Dialog.Trigger>
                <div className="w-5 h-5 relative" onClick={() => setModalAberto(true)}>
                    <Icone.Editar className="absolute inset-0 block w-full h-full" />
                </div>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-preto-400/25 data-[state=open]:animate-overlayShow fixed inset-0 " />
                <Dialog.Content aria-describedby='modal-description' className="flex flex-col gap-y-4 overflow-y-auto data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]  w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none   ">
                    <Dialog.Title className="m-0 font-medium text-lg">
                        Editar cardápio - {DatasHelper.converterParaFormatoBrasileiro(refeicao.cardapio!.date)}
                    </Dialog.Title>
                    <div id="modal-description" className="sr-only">
                        Formulário para editar o cardápio.
                    </div>
                    <form className='flex flex-col gap-y-4' action={handleEditar}>
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="description">
                                Descrição
                            </label>
                            <input
                                className="shadow-preto-400 focus:shadow-preto-400 inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-4 py-2 leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                id="description"
                                placeholder='Ex: Pão com ovos + suco de acerola'
                                name='description'
                                defaultValue={refeicao.cardapio?.description}
                            />
                        </fieldset>
                        <fieldset className='flex flex-col gap-y-2 justify-start' >
                            <label className='font-medium' htmlFor="date">
                                Data
                            </label>
                            <div className='outline outline-1 rounded'>
                                <input
                                    type='date'
                                    id='date'
                                    name='date'
                                    className='px-2 py-1 w-full'
                                    onChange={(e) => handleDataChange(e.target.value)}
                                    defaultValue={refeicao.cardapio?.date}
                                />
                            </div>
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
                                onClick={() => setModalAberto(false)}
                            >
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                        <input
                            name='menu_id'
                            className='hidden'
                            value={refeicao.cardapio?.id}
                        />
                        <input
                            name='meal_id'
                            className='hidden'
                            value={refeicao.refeicao?.id}
                        />
                    </form>
                    <Dialog.Close asChild>
                        <div
                            className="hover:bg-cinza-400 focus:shadow-cinza-400 absolute top-2 right-2 inline-flex p-[0.25em] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none cursor-pointer"
                            aria-label="Fechar"
                            onClick={() => setModalAberto(false)}
                        >
                            <Cross2Icon />
                        </div>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
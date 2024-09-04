"use client"

import { editarCardapio } from '@/app/actions/nutricionista';
import { Botao } from '@/app/elementos/basicos/Botao';
import Icone from '@/app/elementos/basicos/Icone';
import { IRefeicao } from '@/app/elementos/interfaces/IRefeicao';
import useMensagemDeResposta from '@/app/lib/elementos/UseMensagemDeResposta';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

export const ModalEditarCardapio = ({ refeicao }: { refeicao: IRefeicao }) => {
    const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
    const queryClient = useQueryClient();

    const [modalAberto, setModalAberto] = useState(false);

    const { mutate: handleEditar, isPending } = useMutation({
        mutationFn: (formData: FormData) => editarCardapio(formData),
        mutationKey: ['editarCardapio', refeicao.cardapio?.date],
        onMutate: () => {
            atualizarMensagem({ mensagem: 'Salvando cardápio...' });
        },
        onSuccess: (json) => {
            if (!json.sucesso) return atualizarMensagem(json);

            atualizarMensagem({ mensagem: 'Cardápio salvo com sucesso!', sucesso: true });

            setTimeout(() => {
                setModalAberto(false);

                queryClient.invalidateQueries({
                    queryKey: ['refeicoes', refeicao.cardapio?.date],
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

    return (
        <Dialog.Root open={modalAberto}>
            <Dialog.Trigger>
                <div className="w-5 h-5 relative" onClick={() => setModalAberto(true)}>
                    <Icone.Editar className="absolute inset-0 block w-full h-full" />
                </div>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-preto-400/25 data-[state=open]:animate-overlayShow fixed inset-0 " />
                <Dialog.Content aria-describedby='modal-description' className="flex flex-col gap-y-2 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none">
                    <Dialog.Title className="m-0 font-medium text-lg">
                        Editar cardápio
                    </Dialog.Title>
                    <Dialog.Description className='text-cinza-600'>
                        Modifique os campos abaixo para editar o cardápio.
                    </Dialog.Description>
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
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="date">
                                Data
                            </label>
                            <div className='outline outline-1 rounded'>
                                <input
                                    readOnly
                                    type='date'
                                    id='date'
                                    name='date'
                                    className='px-2 py-1 w-full bg-cinza-400 cursor-not-allowed text-cinza-600'
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
                            readOnly
                            aria-hidden
                        />
                        <input
                            name='meal_id'
                            className='hidden'
                            value={refeicao.refeicao?.id}
                            readOnly
                            aria-hidden
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
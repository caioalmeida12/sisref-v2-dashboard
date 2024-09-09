"use client"

import { editarRefeicao } from '@/app/actions/nutricionista';
import { Botao } from '@/app/elementos/basicos/Botao';
import Icone from '@/app/elementos/basicos/Icone';
import { IRefeicao } from '@/app/elementos/interfaces/IRefeicao';
import useMensagemDeResposta from '@/app/lib/elementos/UseMensagemDeResposta';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

export const ModalEditarRefeicao = ({ refeicao }: { refeicao: TRefeicao }) => {
    const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
    const queryClient = useQueryClient();

    const [modalAberto, setModalAberto] = useState(false);

    const { mutate: handleEditar, isPending } = useMutation({
        mutationFn: (formData: FormData) => editarRefeicao(formData),
        mutationKey: ['editarRefeicao', refeicao?.id],
        onMutate: () => {
            atualizarMensagem({ mensagem: 'Salvando refeição...' });
        },
        onSuccess: (json) => {
            if (!json.sucesso) return atualizarMensagem(json);

            atualizarMensagem({ mensagem: 'Refeição salva com sucesso!', sucesso: true });

            setTimeout(() => {
                setModalAberto(false);

                queryClient.invalidateQueries({
                    queryKey: ['tabelaDeRefeicoes'],
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
                        Editar refeição
                    </Dialog.Title>
                    <Dialog.Description className='text-cinza-600'>
                        Modifique os campos abaixo para editar a refeição.
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
                                defaultValue={refeicao?.description}
                            />
                        </fieldset>
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="timeStart">
                                Horário de início
                            </label>
                            <div className='outline outline-1 rounded'>
                                <input
                                    id='timeStart'
                                    name='timeStart'
                                    className='px-2 py-1 w-full bg-cinza-400'
                                    placeholder='Ex: 10:00:00'
                                    defaultValue={refeicao?.timeStart}
                                />
                            </div>
                        </fieldset>
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="timeEnd">
                                Horário de término
                            </label>
                            <div className='outline outline-1 rounded'>
                                <input
                                    id='timeEnd'
                                    name='timeEnd'
                                    className='px-2 py-1 w-full bg-cinza-400'
                                    placeholder='Ex: 12:00:00'
                                    defaultValue={refeicao?.timeEnd}
                                />
                            </div>
                        </fieldset>
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="qtdTimeReservationStart">
                                Quantas horas antes do início da refeição as reservas podem ser feitas?
                            </label>
                            <div className='outline outline-1 rounded'>
                                <input
                                    id='qtdTimeReservationStart'
                                    name='qtdTimeReservationStart'
                                    type='number'
                                    className='px-2 py-1 w-full bg-cinza-400'
                                    placeholder='Ex: 2 (em duas horas antes de a refeição começar estudantes podem reservar)'
                                    defaultValue={refeicao?.qtdTimeReservationStart}
                                />
                            </div>
                        </fieldset>
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="qtdTimeReservationEnd">
                                Quantas horas antes do término da refeição as reservas não podem mais ser feitas?
                            </label>
                            <div className='outline outline-1 rounded'>
                                <input
                                    id='qtdTimeReservationEnd'
                                    name='qtdTimeReservationEnd'
                                    type='number'
                                    className='px-2 py-1 w-full bg-cinza-400'
                                    placeholder='Ex: 2 (em duas horas antes de a refeição terminar estudantes não podem mais reservar)'
                                    defaultValue={refeicao?.qtdTimeReservationEnd}
                                />
                            </div>
                        </fieldset>
                        <input
                            name='meal_id'
                            className='hidden'
                            value={refeicao?.id}
                            readOnly
                            aria-hidden
                        />
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
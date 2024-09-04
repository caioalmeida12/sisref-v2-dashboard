"use client"
import React, { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import Icone from '@elementos//basicos/Icone';
import useMensagemDeResposta from '@/app/lib/elementos/UseMensagemDeResposta';
import { Botao } from '@elementos//basicos/Botao';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removerAgendamento } from '@/app/actions/nutricionista';
import { IAgendamento } from '../../../interfaces/IAgendamento';

interface ModalProps {
    agendamento: IAgendamento;
}

export const ModalRemoverAgendamento: React.FC<ModalProps> = ({ agendamento }) => {
    const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
    const queryClient = useQueryClient();

    const [modalAberto, setModalAberto] = useState(false);

    const { mutate: handleCancelar, isPending } = useMutation({
        mutationFn: () => removerAgendamento({ id: agendamento.id }),
        mutationKey: ['removerAgendamento', agendamento.id],
        onMutate: () => {
            atualizarMensagem({ mensagem: 'Cancelando agendamento...' });
        },
        onSuccess: (json) => {
            if (!json.sucesso) return atualizarMensagem(json);

            atualizarMensagem({ mensagem: 'Agendamento removido com sucesso!', sucesso: true });

            setTimeout(() => {
                setModalAberto(false);

                queryClient.invalidateQueries({
                    queryKey: ['agendamentos', agendamento],
                })

                queryClient.invalidateQueries({
                    queryKey: ['tabelaDeAgendamentos'],
                })
            }, 500);
        },
        onError: (error) => {
            atualizarMensagem({ mensagem: error.message, sucesso: false });
        }
    })

    return (
        <Dialog.Root open={modalAberto}>
            <Dialog.Trigger>
                <div className="w-5 h-5 relative" onClick={() => setModalAberto(true)}>
                    <Icone.Deletar className="absolute inset-0 block w-full h-full" />
                </div>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-preto-400/25 data-[state=open]:animate-overlayShow fixed inset-0 " />
                <Dialog.Content className="flex flex-col gap-y-4 overflow-y-auto data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]  w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none   ">
                    <Dialog.Title className="m-0 font-medium text-lg">
                        Tem certeza que deseja remover este agendamento?
                    </Dialog.Title>
                    <Dialog.Description className="leading-normal">
                        {
                            agendamento.menu?.description
                                ? `Você está prestes a remover o agendamento do dia ${agendamento.menu.date} com a descrição "${agendamento.menu.description}"  e ID ${agendamento.menu.id} para ${agendamento.student.name}`
                                : `Você está prestes a remover o agendamento do dia ${agendamento.menu?.date}`
                        }
                    </Dialog.Description>
                    <div ref={mensagemDeRespostaRef} className="hidden"></div>
                    <Botao variante="remover" texto="Sim, desejo remover" disabled={isPending} onClick={() => handleCancelar()} />
                    <Dialog.Close asChild>
                        <div
                            className="hover:bg-cinza-400 focus:shadow-cinza-400 absolute top-2 right-2 inline-flex p-[0.25em] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none cursor-pointer"
                            aria-label="Fechar"
                            onClick={() => setModalAberto(false)}
                        >
                            <Cross2Icon />
                        </div>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                        <Botao variante="editar" texto="Não, não desejo remover" onClick={() => setModalAberto(false)} />
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

"use client"
import React, { useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Botao } from '../../../basicos/Botao';
import { Cross2Icon } from '@radix-ui/react-icons';
import { BotaoDeRefeicao } from '.';

interface ModalProps {
    meal_id?: number;
    date?: string;
}

export const _ModalDeCancelar: React.FC<ModalProps> = ({ meal_id, date }) => {
    const refBotaoFechar = useRef<HTMLButtonElement>(null);

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Botao variante="remover" texto="Cancelar" />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-preto-400/25 data-[state=open]:animate-overlayShow fixed inset-0 " />
                <Dialog.Content className="flex flex-col gap-y-4 overflow-y-auto data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]  w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none   ">
                    <Dialog.Title className="m-0 font-medium text-lg">
                        Tem certeza que deseja cancelar a sua reserva?
                    </Dialog.Title>
                    <Dialog.Description className="leading-normal">
                        Caso cancele sua reserva, não será possível reservar novamente.
                    </Dialog.Description>
                    <BotaoDeRefeicao.Cancelar meal_id={meal_id!} date={date!} ref_botao_fechar={refBotaoFechar} />
                    <Dialog.Close asChild>
                        <button
                            ref={refBotaoFechar}
                            name='Fechar'
                            className="hover:bg-cinza-400 focus:shadow-cinza-400 absolute top-2 right-2 inline-flex p-[0.25em] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                            aria-label="Fechar"
                        >
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                        <Botao variante="editar" texto="Não, não desejo cancelar" />
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
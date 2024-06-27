"use client"

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Botao } from '../../basicos/Botao';
import Modal from './Modal';

export const AdicionarCardapio = () => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <Botao variante='adicionar' texto='Adicionar Cardápio' />
        </Dialog.Trigger>
        <Modal />
    </Dialog.Root>
);
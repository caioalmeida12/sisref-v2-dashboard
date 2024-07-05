"use client"

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Botao } from '../../basicos/Botao';
import Modal from './Modal';

export const AdicionarRelatorio = () => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <Botao variante='adicionar' texto='Adicionar Relatorio' />
        </Dialog.Trigger>
        <Modal />
    </Dialog.Root>
);
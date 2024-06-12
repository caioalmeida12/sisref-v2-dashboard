"use client"

import React from 'react'

import { Botao } from "../basicos/Botao";
import { IconeAviso } from "../basicos/icones/IconeAviso";
import { IconeDropdown } from '../basicos/icones/IconeDropdown';


interface AvisoProps {
    titulo: string;
    texto: string;
    textoBotao?: string;
}

export const AvisoDoQuadro = ({ titulo, texto }: AvisoProps) => {
    return (
        <div className="flex flex-col p-4 rounded gap-x-2 gap-y-4 border-[1px] border-cinza-600">
            <div className='flex justify-between items-center'>
                <h2 className="font-bold flex gap-x-2 items-center">{titulo}</h2>
            </div>
            <p>
                {texto}
            </p>
            <Botao texto="Remover" variante="remover" />
        </div>
    );
}
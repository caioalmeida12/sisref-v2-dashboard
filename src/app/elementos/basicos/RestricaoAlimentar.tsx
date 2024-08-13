"use client"

import React from 'react'

import { MouseEventHandler } from "react";
import Icone from './icones';

interface RestricaoAlimentarProps {
    texto: string
    onRemove?: MouseEventHandler<HTMLButtonElement>
}

export const RestricaoAlimentar = ({ texto, onRemove }: RestricaoAlimentarProps) => {
    return (
        <div className="flex p-4 justify-between item-center relative rounded border-[1px] border-cinza-600">
            <div className="flex gap-2 items-center relative">
                <Icone.RestricaoAlimentar />
                <p className="font-bold leading-4 text-sm text-preto-400">{texto}</p>
            </div>
            <div className="flex gap-2 items-center relative text-vermelho-400 hover:font-medium">
                <button name='Remover' onClick={onRemove} className="cursor-pointer">Remover</button>
            </div>
        </div>

    )
}
"use client"

import React from 'react'

import { MouseEventHandler } from "react";
import { IconeRestricaoAlimentar } from "./icones/IconeRestricaoAlimentar";

interface RestricaoAlimentarProps {
    texto: string
    onRemove?: MouseEventHandler<HTMLButtonElement>
}


export const RestricaoAlimentar = ({ texto, onRemove }: RestricaoAlimentarProps) => {
    return (
        <div className="flex p-4 justify-between item-center relative rounded border-[1px] border-cinza-600">
            <div className="flex gap-2 items-center relative">
                <IconeRestricaoAlimentar />
                <p className="font-bold leading-4 text-sm text-preto-400">{texto}</p>
            </div>
            <div className="flex gap-2 items-center relative text-vermelho-400 hover:font-medium">
                <button onClick={onRemove} className="cursor-pointer">Remover</button>
            </div>
        </div>

    )
}
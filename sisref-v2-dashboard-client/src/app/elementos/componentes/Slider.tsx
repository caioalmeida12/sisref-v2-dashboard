"use client"

import React from 'react'

import { IconeSeta } from "@elementos/basicos/icones/IconeSeta";

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
    texto: string;
    onNext?: () => void;
    onPrevious?: () => void;
}

export const Slider = ({ texto, onPrevious, onNext, ...rest }: SliderProps) => {
    return (
        <div className={`${rest.className} p-4 bg-cinza-600 text-center text-branco-400 font-bold rounded justify-between flex items-center`}>
            <button onClick={onPrevious}>
                <IconeSeta fill="fill-branco-400" direcao="esquerda" />
            </button>
            {texto}
            <button onClick={onNext}>
                <IconeSeta fill="fill-branco-400" direcao="direita" />
            </button>
        </div>
    );
}
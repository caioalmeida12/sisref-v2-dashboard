"use client"

import React from 'react'

import { IconeSeta } from "@elementos/basicos/icones/IconeSeta";

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
    texto: string;
    tooltip?: React.ReactNode;
    onNext?: () => void;
    onPrevious?: () => void;
}

export const Slider = ({ texto, onPrevious, onNext, tooltip, ...rest }: SliderProps) => {
    return (
        <div className={`${rest.className} p-4 bg-cinza-600 text-center text-branco-400 font-bold rounded justify-between flex items-center`}>
            <button name='Ver dia anterior' onClick={onPrevious} className='relative before:content-[""] before:inset-[-.5em] before:rounded before:opacity-10 before:bg-branco-400 hover:before:absolute'>
                <IconeSeta fill='fill-branco-400' direcao="esquerda"/>
            </button>
            <span className='flex justify-center gap-x-2'>{texto}{tooltip}</span>
            <button name='Ver dia posterior' onClick={onNext} className='relative before:content-[""] before:inset-[-.5em] before:rounded before:opacity-10 before:bg-branco-400 hover:before:absolute'>
                <IconeSeta fill='fill-branco-400' direcao="direita"/>
            </button>
        </div>
    );
}
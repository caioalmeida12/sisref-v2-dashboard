"use client"

import React from 'react'

import { IconeSeta } from "@elementos/basicos/icones/IconeSeta";
import Link from 'next/link';

interface SliderServerSideProps extends React.HTMLAttributes<HTMLDivElement> {
    texto: string;
    tooltip?: React.ReactNode;
    onNext: string;
    onPrevious: string;
}

export const SliderServerSide = ({ texto, onPrevious, onNext, tooltip, ...rest }: SliderServerSideProps) => {
    return (
        <div className={`${rest.className} p-4 bg-cinza-600 text-center text-branco-400 font-bold rounded justify-between flex items-center`}>
            <Link href={onPrevious} scroll={false} className='relative before:content-[""] before:inset-[-.5em] before:rounded before:opacity-10 before:bg-branco-400 hover:before:absolute'>
                <IconeSeta fill='fill-branco-400' direcao="esquerda"/>
            </Link>
            <span className='flex justify-center gap-x-2'>{texto}{tooltip}</span>
            <Link href={onNext}  scroll={false} className='relative before:content-[""] before:inset-[-.5em] before:rounded before:opacity-10 before:bg-branco-400 hover:before:absolute'>
                <IconeSeta fill='fill-branco-400' direcao="direita"/>
            </Link>
        </div>
    );
}
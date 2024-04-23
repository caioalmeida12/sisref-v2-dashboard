"use client"

import React, { useRef } from 'react'

import { Botao } from "../basicos/Botao";
import { IconeAviso } from "../basicos/icones/IconeAviso";
import { IconeDropdown } from '../basicos/icones/IconeDropdown';

interface AvisoProps {
    titulo: string;
    texto: string;
    textoBotao?: string;
}

export const Aviso = ({ titulo, texto, textoBotao }: AvisoProps) => {
    const elementoPai = useRef<HTMLDivElement>(null);

    const lerVisibilidade = () => {
        if (!elementoPai.current) return false;

        const aberto = elementoPai.current!.getAttribute("data-aberto");

        return aberto === "true";
    }

    const alterarVisibilidade = (visibilidade: boolean) => {
        if (!elementoPai.current) return false;

        elementoPai.current.dataset.aberto = visibilidade.toString();
    }

    return (
        <div className="bg-vermelho-400 text-branco-400 p-4 rounded gap-x-2 gap-y-4 grid group transition" ref={elementoPai} data-aberto={"true"}>
            <div className='flex justify-between items-center'>
                <h2 className="font-bold text-branco-400 flex gap-x-2 items-center"><IconeAviso />{titulo}</h2>
                <IconeDropdown variante='circulo' className='rotate-0 group-data-[aberto=true]:rotate-180 transition' onClick={() => alterarVisibilidade(!lerVisibilidade())} />
            </div>
            <p className="hidden opacity-0 transition-opacity group-data-[aberto=true]:block group-data-[aberto=true]:opacity-100">
                {texto}
            </p>
            <div className="hidden opacity-0 transition-opacity group-data-[aberto=true]:block group-data-[aberto=true]:opacity-100">
                <Botao texto={textoBotao || "Entendido"} variante="ocultar" onClick={() => alterarVisibilidade(false)} />
            </div>
        </div>
    );
}
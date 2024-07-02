"use client"

import React, { useRef } from 'react'

import { Botao } from "../basicos/Botao";
import { IconeAviso } from "../basicos/icones/IconeAviso";
import { IconeDropdown } from '../basicos/icones/IconeDropdown';

import { toggle } from "slide-element"

interface AvisoProps {
    titulo: string;
    texto: string;
    textoBotao?: string;
}

export const Aviso = ({ titulo, texto, textoBotao }: AvisoProps) => {
    const elementoPai = useRef<HTMLDivElement>(null);
    const elementoConteudo = useRef<HTMLParagraphElement>(null);
    const tempoPressionado = useRef<number>(0);

    const iniciarPressionamento = () => {
        tempoPressionado.current = Date.now();
    }

    const finalizarPressionamento = () => {
        if (Date.now() - tempoPressionado.current < 200) {
            alterarVisibilidade(elementoConteudo.current);
        }
    }

    const alterarVisibilidade = (elemento: HTMLElement | null) => {
        if (!elemento) return;
        
        const estaAberto = elementoPai.current?.getAttribute('data-state') === 'open';
        const proximoEstado = !estaAberto;
        const proximoEstadoString = proximoEstado ? 'open' : 'closed';

        elementoPai.current?.setAttribute('data-state', proximoEstadoString);

        toggle(elemento);
    }

    return (
        <div className="bg-vermelho-400 text-branco-400 p-4 rounded gap-x-2 gap-y-4 group col-left peer" ref={elementoPai} data-state="open" onMouseDown={iniciarPressionamento} onMouseUp={finalizarPressionamento}>
            <div className='flex justify-between items-center'>
                <h2 className="font-bold text-branco-400 flex gap-x-2 items-center"><IconeAviso />{titulo}</h2>
                <button className='relative before:content-[""] before:inset-[-.5em] before:rounded before:opacity-10 before:bg-branco-400 hover:before:absolute'>
                <IconeDropdown variante='sem-circulo' />
                </button>
            </div>
            <div className='transition-all duration-300' ref={elementoConteudo}>
                <p className='mb-4 mt-4 transition-opacity opacity-0 group-data-[state=open]:opacity-100'>
                    {texto}
                </p>
                <Botao texto={textoBotao || "Entendido"} variante="ocultar" />
            </div>
        </div>
    );
}
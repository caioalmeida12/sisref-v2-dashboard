import React from 'react'

import { Botao } from "./Botao";
import { IconeAviso } from "./icones/IconeAviso";

interface AvisoProps {
    titulo: string;
    texto: string;
    textoBotao?: string;
}

export const Aviso = ({ titulo, texto, textoBotao }: AvisoProps) => {
    return (
        <div className="bg-vermelho-400 p-4 rounded gap-x-2 gap-y-4 grid">
            <h2 className="font-bold text-branco-400 flex gap-x-2 items-center text-lg"><IconeAviso />{titulo}</h2>
            <p className="text-branco-400 text-justify">
                {texto}
            </p>
            <Botao texto={textoBotao || "Entendido"} variante="ocultar" />
        </div>
    );
}
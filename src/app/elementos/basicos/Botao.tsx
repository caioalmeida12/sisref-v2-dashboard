import React, { forwardRef } from 'react'
import classnames from 'classnames';

import { ButtonHTMLAttributes } from "react";

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    texto: string;
    variante: "adicionar" | "remover" | "editar" | "ocultar";
}

const classNamePorVariante = {
    adicionar: "bg-verde-300 hover:outline-verde-400",
    remover: "bg-branco-400 border-vermelho-400 border-[1px] text-vermelho-400 hover:outline-vermelho-400",
    editar: "bg-cinza-600 text-branco-400 hover:outline-preto-400",
    ocultar: "bg-branco-400 text-preto-400 hover:outline-preto-400",
};

export const Botao = forwardRef<HTMLButtonElement, BotaoProps>(({ texto, variante, className, disabled, ...rest }, ref) => {
    return (
        <button {...rest} ref={ref} className={classnames(`p-4 rounded-md text-branco-400 font-bold w-full outline-2 hover:outline hover:animate-outline h-fit`, classNamePorVariante[variante], className, { 'opacity-50 cursor-not-allowed': disabled })} disabled={disabled}>
            {texto}
        </button>
    );
});

Botao.displayName = 'Botao';
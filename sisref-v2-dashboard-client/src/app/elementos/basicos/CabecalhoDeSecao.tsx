import React from 'react'

import { HTMLAttributes } from "react";

interface CabecalhoDeSecaoProps extends HTMLAttributes<HTMLElement> {
    titulo: string;
}

export const CabecalhoDeSecao = ({ titulo, ...rest }: CabecalhoDeSecaoProps) => {
    const className = rest.className ? rest.className : '';

    return (
        <header className={`bg-preto-400 p-4 rounded ${className}`}>
            <h2 className="text-branco-400 text-center font-bold">{titulo}</h2>
        </header>
    );
}
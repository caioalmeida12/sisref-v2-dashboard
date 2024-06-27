import React from 'react'

import { HTMLAttributes } from "react";
import classnames from 'classnames';

interface CabecalhoDeSecaoProps extends HTMLAttributes<HTMLElement> {
    titulo: string;
}

export const CabecalhoDeSecao = ({ titulo, className, ...rest }: CabecalhoDeSecaoProps) => {
    return (
        <header {...rest} className={classnames('bg-preto-400 p-4 rounded', className)}>
            <h2 className="text-branco-400 text-center font-bold">{titulo}</h2>
        </header>
    );
}
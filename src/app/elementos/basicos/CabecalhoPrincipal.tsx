import React from 'react'

import { HTMLAttributes } from "react";

interface CabecalhoPrincipalProps extends HTMLAttributes<HTMLElement> {
    titulo: string;
}

export const CabecalhoPrincipal = ({ titulo, ...rest } : CabecalhoPrincipalProps) => {
    return (
        <header {...rest}>
            <h2 className="font-bold text-verde-400">{titulo}</h2>
        </header>
    );
}
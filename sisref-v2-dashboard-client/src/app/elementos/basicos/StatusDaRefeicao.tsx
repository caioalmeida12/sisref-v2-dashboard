import React from 'react'

import { IIconeStatusProps } from "@elementos/interfaces/IIconeStatusProps";
import { IconeStatus } from "./icones/IconeStatus";

interface StatusDaRefeicaoProps {
    texto: string;
    cor: keyof typeof classNamePorCor;
    icone: IIconeStatusProps["variante"];
}

const classNamePorCor = {
    "verde-300": {
        fill: "fill-verde-300",
        text: "text-verde-300"
    },
    "vermelho-400": {
        fill: "fill-vermelho-400",
        text: "text-vermelho-400"
    },
    "cinza-600": {
        fill: "fill-cinza-600",
        text: "text-cinza-600"
    },
    "amarelo-200": {
        fill: "fill-amarelo-200",
        text: "text-amarelo-200"
    },
    "azul-400": {
        fill: "fill-azul-400",
        text: "text-azul-400"
    },
} as const;

export const StatusDaRefeicao = ({ texto, cor, icone }: StatusDaRefeicaoProps) => {
    return (
        <div className="flex items-center gap-x-2 leading-normal">
            <p className={`${classNamePorCor[cor].text}`}>{texto}</p>
            <IconeStatus fill={classNamePorCor[cor].fill || "fill-cinza-600"} variante={icone} />
        </div>
    )
}
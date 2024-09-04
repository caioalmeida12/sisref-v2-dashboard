import React from 'react';

import Icone from './Icone';
import { IIconeStatusProps } from '@elementos/interfaces/IIcones';
import { CustomTooltipWrapper } from './CustomTooltipWrapper';

interface StatusDaRefeicaoProps {
    texto: string;
    cor: keyof typeof classNamePorCor;
    icone: IIconeStatusProps["variante"];
    textoTooltip?: string;
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

export const StatusDaRefeicao = ({ texto, cor, icone, textoTooltip }: StatusDaRefeicaoProps) => {
    return (
        <CustomTooltipWrapper
            elementoTrigger={
                <div className="flex items-center gap-x-2 leading-normal">
                    <p className={`${classNamePorCor[cor].text}`}>{texto}</p>
                    <Icone.Status fill={classNamePorCor[cor].fill || "fill-cinza-600"} variante={icone} />
                </div>
            }
            elementoContent={
                <p>{textoTooltip}</p>
            }
        />
    )
}
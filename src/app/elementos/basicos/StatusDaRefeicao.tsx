import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

import { IIconeStatusProps } from "@elementos/interfaces/IIconeStatusProps";
import { IconeStatus } from "./icones/IconeStatus";

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
        <Tooltip.Provider delayDuration={100}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <div className="flex items-center gap-x-2 leading-normal">
                        <p className={`${classNamePorCor[cor].text} w-min`}>{texto}</p>
                        <IconeStatus fill={classNamePorCor[cor].fill || "fill-cinza-600"} variante={icone} />
                    </div>
                </Tooltip.Trigger>
                {textoTooltip && (
                    <Tooltip.Portal>
                        <Tooltip.Content
                            className="bg-branco-400 border border-cinza-600 shadow-lg rounded-md p-2 text-sm"
                            sideOffset={5}
                        >
                            {textoTooltip}
                            <Tooltip.Arrow className="fill-branco-400" />
                        </Tooltip.Content>
                    </Tooltip.Portal>
                )}
            </Tooltip.Root>
        </Tooltip.Provider>
    )
}
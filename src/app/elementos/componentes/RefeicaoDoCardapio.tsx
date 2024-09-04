import React from "react";

import { Secao } from "@elementos/basicos/Secao";
import { IRefeicaoComTurno } from "../interfaces/IRefeicao";
import { NomeDaRefeicao } from "@elementos/basicos/NomeDaRefeicao";

const varianteNomeRefeicaoPorTurno = {
    1: "manha",
    2: "almoco",
    3: "tarde",
    4: "noite"
} as const;

/**
 * Converte a descrição do cardápio em um array de strings.
 * @param descricao - A descrição do cardápio.
 * @returns O array de strings.
 */
const descricaoCardapioParaArrayStrings = (descricao: string) => {
    return descricao.split(/[;+]/).filter(naoVazio => naoVazio)
}


export const RefeicaoDoCardapio = (props: IRefeicaoComTurno) => {
    if (!props.cardapio) return null;

    return (
        <Secao className="flex flex-col gap-y-2">
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteNomeRefeicaoPorTurno[props.turno]} />
                <div className="text-cinza-600"> Id: {props.cardapio.id} </div>
            </div>
            <p className="leading-6">
                {descricaoCardapioParaArrayStrings(props.cardapio.description).map((descricao, index) => (
                    <React.Fragment key={index}>
                        <span>
                            {descricao}
                        </span>
                        <br />
                    </React.Fragment>
                ))}
            </p>
        </Secao>
    )
};
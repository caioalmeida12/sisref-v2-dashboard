import React from "react";

import { Secao } from "@elementos/basicos/Secao";
import { NomeDaRefeicao } from "@elementos/basicos/NomeDaRefeicao";
import { TRefeicaoECardapio } from "@/app/interfaces/TRefeicao";

/**
 * Converte a descrição do cardápio em um array de strings.
 * @param descricao - A descrição do cardápio.
 * @returns O array de strings.
 */
const descricaoCardapioParaArrayStrings = (descricao: string) => {
  return descricao.split(/[;+]/).filter((naoVazio) => naoVazio);
};

export const RefeicaoDoCardapio = (props: TRefeicaoECardapio) => {
  if (!props.meal) return null;

  return (
    <Secao className="flex flex-col gap-y-2">
      <div className="flex justify-between">
        <NomeDaRefeicao refeicao={props.meal} />
        <div className="text-cinza-600"> Id: {props.meal.id} </div>
      </div>
      <p className="leading-6">
        {descricaoCardapioParaArrayStrings(props.meal.description).map(
          (descricao, index) => (
            <React.Fragment key={index}>
              <span>{descricao}</span>
              <br />
            </React.Fragment>
          ),
        )}
      </p>
    </Secao>
  );
};

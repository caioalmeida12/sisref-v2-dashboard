"use client";

import { CabecalhoDeSecao } from "@elementos/basicos/CabecalhoDeSecao";
import { Secao } from "@elementos/basicos/Secao";
import { TextoDescritivo } from "./TextoDescritivo";

export const RestricoesAlimentares = () => {
  return (
    <div className={`flex flex-col gap-4 lg:flex`} id="restricoesAlimentares">
      <TextoDescritivo />
      <Secao className="flex flex-col gap-4">
        <CabecalhoDeSecao titulo="Suas restrições alimentares" />
        <p className="text-justify">
          Você não possui restrições alimentares cadastradas. Caso queira
          adicionar alguma, entre em contato com a pessoa nutricionista.
        </p>
        {/* <Botao
          texto="Adicionar"
          variante="adicionar"
          onClick={handleAdicionarRestricao}
        /> */}
      </Secao>
    </div>
  );
};

import React from "react";
import { Secao } from "../basicos/Secao";
import { CabeçalhoDeSecao } from "../basicos/CabecalhoDeSecao";
import { RefeicaoAutorizada } from "../componentes/RefeicaoAutorizada";

export const RefeicoesAutorizadas = () => {

    return (
        <Secao className="flex flex-col gap-y-4">
            <CabeçalhoDeSecao titulo="Refeições autorizadas"/>

            {
                (["manha", "almoco", "tarde", "noite"] as const).map((variante, index) => (
                    <RefeicaoAutorizada key={index} variante={variante} dias={["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira"].filter(() => Math.round(Math.random()))}  />
                ))
            }
        </Secao>
    )
}
import React from "react";
import { Secao } from "../basicos/Secao";
import { CabecalhoDeSecao } from "../basicos/CabecalhoDeSecao";
import { RefeicaoAutorizada } from "../componentes/RefeicaoAutorizada";
import { InformacoesDeEstudante } from "./InformacoesDeEstudante";

export const RefeicoesAutorizadas = () => {

    return (
        <>
            <InformacoesDeEstudante versaoMobileCompleta />
            <Secao className="flex flex-col gap-y-4 col-left">
                <CabecalhoDeSecao titulo="Refeições autorizadas" />

                {
                    (["manha", "almoco", "tarde", "noite"] as const).map((variante, index) => (
                        <RefeicaoAutorizada key={index} variante={variante} dias={["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira"].filter(() => Math.round(Math.random()))} />
                    ))
                }
            </Secao>
        </>
    )
}
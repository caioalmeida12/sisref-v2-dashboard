import React from "react";
import { Secao } from "../basicos/Secao";
import { CabecalhoDeSecao } from "../basicos/CabecalhoDeSecao";
import { RefeicaoAutorizada } from "../componentes/RefeicaoAutorizada";
import { InformacoesDeEstudante } from "./InformacoesDeEstudante";

export const RefeicoesAutorizadas = ({ forcarExibicao = false }: { forcarExibicao?: boolean }) => {

    return (
        <>
            <div className={`${forcarExibicao ? "block" : "hidden"}`}>
                <InformacoesDeEstudante versaoMobileCompleta />
            </div>
            <Secao className={`${forcarExibicao ? "flex" : "hidden"} flex-col gap-y-4 col-left`}>
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
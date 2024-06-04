import React from "react";
import { CabecalhoDeSecao } from "../basicos/CabecalhoDeSecao";
import { Secao } from "../basicos/Secao"
import { RefeicaoDoCardapio } from "../componentes/RefeicaoDoCardapio";
import { Botao } from "../basicos/Botao";
import { Slider } from "../componentes/Slider";
import { fetchRefeicoesPorDia } from "@/app/actions/fetchRefeicoesPorDia";

export const Cardapios = async ({ data }: { data?: string }) => {

    const cardapios = await fetchRefeicoesPorDia({ data });

    return (
        <Secao className="flex flex-col gap-y-4">
            <CabecalhoDeSecao titulo='Cardápios' />
            {
                cardapios.length ?
                    cardapios.map((refeicao, index) => (
                        <RefeicaoDoCardapio key={index} {...refeicao} />
                    )) :
                    <p>Não há cardápios para esta data.</p>
            }
            <Botao variante="adicionar" texto="Adicionar Cardápio" />
            <Slider texto="20/01/2024" />
        </Secao>
    );
}
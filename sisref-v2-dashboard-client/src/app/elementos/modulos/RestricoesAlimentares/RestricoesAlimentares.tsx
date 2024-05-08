"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Botao } from "../../basicos/Botao"
import { CabecalhoDeSecao } from "../../basicos/CabecalhoDeSecao"
import { Secao } from "../../basicos/Secao"
import { TextoDescritivo } from "./TextoDescritivo"
import { RestricaoAlimentar } from "../../basicos/RestricaoAlimentar"

export const RestricoesAlimentares = () => {
    const [restricoes, setRestricoes] = useState<string[]>([])

    useEffect(() => {
        setRestricoes(["Glúten", "Leite", "Cebola"])
    }, [])

    const handleAdicionarRestricao = () => {
        const restricao = prompt("Digite a restrição alimentar que deseja adicionar")
        if (!restricao) return

        setRestricoes([...restricoes, restricao])
    }

    const handleRemoverRestricao = (e: React.MouseEvent) => {
        const restricao = e.currentTarget?.parentElement?.previousSibling?.textContent
        if (!restricao) return

        setRestricoes(restricoes.filter(item => item !== restricao))
    }

    return (
        <div className="flex flex-col gap-4">
            <TextoDescritivo />
            <Secao className="flex flex-col gap-4">
                <CabecalhoDeSecao titulo="Suas restrições alimentares" />
                {
                    restricoes.map((item, index) => <RestricaoAlimentar key={index} texto={item} onRemove={handleRemoverRestricao} />)
                }
                <Botao texto="Adicionar" variante="adicionar" onClick={handleAdicionarRestricao} />
            </Secao>
        </div>
    )
}
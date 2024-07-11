"use client"

import React, { useCallback } from "react"
import { Botao } from "../../basicos/Botao"
import { cancelarRefeicao } from "@/app/actions/cancelarRefeicao"
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta"

export const Cancelar = ({ meal_id, date }: { meal_id?: number, date?: string }) => {
    const { carregando, mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();

    const handleCancelar = useCallback(async () => {
        atualizarMensagem({ mensagem: 'Cancelando...' });

        const resposta = await cancelarRefeicao({ meal_id, date })

        atualizarMensagem(resposta);
    }, [meal_id, date, atualizarMensagem]);

    return (
        <>
            <div ref={mensagemDeRespostaRef} className="hidden"></div>
            <Botao variante="remover" texto="Cancelar" onClick={handleCancelar} disabled={carregando} />
        </>
    )
}
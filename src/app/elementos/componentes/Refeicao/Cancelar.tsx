"use client"

import React, { useCallback } from "react"
import { Botao } from "../../basicos/Botao"
import { cancelarRefeicao } from "@/app/actions/cancelarRefeicao"
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta"
import { useRefeicoes } from "@/app/lib/elementos/RefeicoesContext"

export const Cancelar = ({ meal_id, date }: { meal_id?: number, date?: string }) => {
    const { carregando, mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
    const { recarregar, setRecarregar } = useRefeicoes();

    const handleCancelar = useCallback(async () => {
        atualizarMensagem({ mensagem: 'Cancelando...' });

        const resposta = await cancelarRefeicao({ meal_id, date })

        if (resposta.sucesso) {
            setRecarregar(!recarregar);
        }

        atualizarMensagem(resposta);
    }, [meal_id, date, atualizarMensagem]);

    return (
        <>
            <div ref={mensagemDeRespostaRef} className="hidden"></div>
            <Botao variante="remover" texto="Cancelar" onClick={handleCancelar} disabled={carregando} />
        </>
    )
}
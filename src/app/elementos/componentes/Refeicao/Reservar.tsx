"use client"

import React, { useCallback } from "react"
import { Botao } from "../../basicos/Botao"
import { reservarRefeicao } from "@/app/actions/reservarRefeicao"
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta"
import { useRefeicoes } from "@/app/lib/elementos/RefeicoesContext"

export const Reservar = ({ meal_id, date }: { meal_id?: number, date?: string }) => {
    const { carregando, mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
    const { recarregar, setRecarregar } = useRefeicoes();

    const handleReservar = useCallback(async () => {
        atualizarMensagem({ mensagem: 'Reservando...' });

        const resposta = await reservarRefeicao({ meal_id, date })

        if (resposta.sucesso) {
            setRecarregar(!recarregar);
        }

        atualizarMensagem(resposta);
    }, [meal_id, date, atualizarMensagem]);

    return (
        <>
            <div ref={mensagemDeRespostaRef} className="hidden"></div>
            <Botao variante="adicionar" texto="Reservar" onClick={handleReservar} disabled={carregando} />
        </>
    )
}
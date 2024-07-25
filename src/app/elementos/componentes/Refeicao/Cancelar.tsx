"use client"

import React, { useCallback, useEffect } from "react"
import { Botao } from "../../basicos/Botao"
import { cancelarRefeicao } from "@/app/actions/cancelarRefeicao"
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/app/lib/elementos/QueryClient"

export const Cancelar = ({ meal_id, date }: { meal_id?: number, date?: string }) => {
    const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();

    const { data: reserva, mutate, isPending } = useMutation({
        mutationFn: () => cancelarRefeicao({ meal_id, date }),
        onMutate: () => {
            atualizarMensagem({ mensagem: 'Reservando...' });
        },
        onError: (error) => {
            atualizarMensagem({ mensagem: error.message });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['refeicoesPorDia', 'historicoDeRefeicoes'],
                refetchType: 'all'
            });
        }
    })

    useEffect(() => {
        reserva && atualizarMensagem(reserva);
    }, [reserva]);

    const handleCancelar = useCallback(() => mutate(), [mutate]);

    return (
        <>
            <div ref={mensagemDeRespostaRef} className="hidden"></div>
            <Botao variante="remover" texto="Cancelar" onClick={handleCancelar} disabled={isPending} />
        </>
    )
}
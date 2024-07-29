"use client"

import React, { useCallback } from "react"
import { Botao } from "../../basicos/Botao"
import { cancelarRefeicao } from "@/app/actions/cancelarRefeicao"
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const Cancelar = ({ meal_id, date }: { meal_id?: number, date?: string }) => {
    const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => cancelarRefeicao({ meal_id, date }),
        mutationKey: ['cancelarRefeicao', meal_id, date],
        onMutate: () => {
            atualizarMensagem({ mensagem: 'Cancelando...' });
        },
        onError: (error) => {
            atualizarMensagem({ mensagem: error.message });
        },
        onSuccess: (resposta) => {
            queryClient.invalidateQueries({
                queryKey: ['refeicoesPorDia'],
            });

            queryClient.invalidateQueries({
                queryKey: ['historicoDeRefeicoes'],
            });

            atualizarMensagem(resposta);
        }
    })

    const handleCancelar = useCallback(() => mutate(), [mutate]);

    return (
        <>
            <div ref={mensagemDeRespostaRef} className="hidden"></div>
            <Botao variante="remover" texto="Cancelar" onClick={handleCancelar} disabled={isPending} />
        </>
    )
}
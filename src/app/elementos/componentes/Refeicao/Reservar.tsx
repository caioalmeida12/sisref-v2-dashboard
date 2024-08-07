"use client"

import React, { useCallback } from "react"
import { Botao } from "../../basicos/Botao"
import { reservarRefeicao } from "@/app/actions/reservarRefeicao"
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export const Reservar = ({ meal_id, date }: { meal_id?: number, date?: string }) => {
    const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => reservarRefeicao({ meal_id, date }),
        mutationKey: ['reservarRefeicao', meal_id, date],
        onMutate: () => {
            atualizarMensagem({ mensagem: 'Reservando...' });
        },
        onError: (error) => {
            atualizarMensagem({ mensagem: error.message, sucesso: false });
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

    const handleReservar = useCallback(() => mutate(), [mutate]);

    return (
        <>
            <div ref={mensagemDeRespostaRef} className="hidden"></div>
            <Botao variante="adicionar" texto="Reservar" onClick={handleReservar} disabled={isPending} />
        </>
    )
}
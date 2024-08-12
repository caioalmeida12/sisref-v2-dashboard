"use client"

import React, { useCallback, useState, useEffect } from "react"
import { Botao } from "../../basicos/Botao"
import { cancelarRefeicao } from "@/app/actions/cancelarRefeicao"
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const Cancelar = ({ meal_id, date, ref_botao_fechar }: { meal_id?: number, date?: string, ref_botao_fechar: React.RefObject<HTMLButtonElement> }) => {
    const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
    const queryClient = useQueryClient();
    const [botaoDesativado, setBotaoDesativado] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setBotaoDesativado(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const { mutate, isPending } = useMutation({
        mutationFn: () => cancelarRefeicao({ meal_id, date }),
        mutationKey: ['cancelarRefeicao', meal_id, date],
        onMutate: () => {
            atualizarMensagem({ mensagem: 'Cancelando...' });
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

            setTimeout(() => {
                ref_botao_fechar.current?.click();
            }, 750);
        }
    })

    const handleCancelar = useCallback(() => {
        mutate();
    }, [mutate]);

    return (
        <>
            <div ref={mensagemDeRespostaRef} className="hidden"></div>
            <Botao variante="remover" texto="Sim, desejo cancelar" onClick={handleCancelar} disabled={isPending || botaoDesativado} />
        </>
    )
}
"use client"

import { useRef, useState, useCallback } from "react"
import { Botao } from "../../basicos/Botao"
import { cancelarRefeicao } from "@/app/actions/cancelarRefeicao" // Alterado para importar a função de cancelamento
import { revalidatePath } from "next/cache"

export const Cancelar = ({ meal_id, date }: { meal_id?: number, date?: string }) => {
    const mensagemDeResposta = useRef<HTMLDivElement>(null);
    const [cancelando, setCancelando] = useState(false);

    const handleCancelar = useCallback(async () => {
        setCancelando(true);

        mensagemDeResposta.current?.classList.remove('hidden', 'text-vermelho-400', 'text-verde-400');
        mensagemDeResposta.current?.classList.add('text-azul-400');
        mensagemDeResposta.current!.textContent = 'Cancelando...';

        const resposta = await cancelarRefeicao({ meal_id, date })

        if (resposta.sucesso) {
            mensagemDeResposta.current!.textContent = resposta.mensagem;
            mensagemDeResposta.current!.classList.remove('text-vermelho-400', 'text-azul-400');
            mensagemDeResposta.current!.classList.add('text-verde-400');

            revalidatePath("/")
        } else {
            mensagemDeResposta.current!.textContent = resposta.mensagem;
            mensagemDeResposta.current!.classList.remove('text-verde-400', 'text-azul-400');
            mensagemDeResposta.current!.classList.add('text-vermelho-400');
        }

        setCancelando(false);
    }, [meal_id, date, mensagemDeResposta]);

    return (
        <>
            <div ref={mensagemDeResposta} className="hidden"></div>
            <Botao variante="remover" texto="Cancelar" onClick={handleCancelar} />
        </>
    )
}
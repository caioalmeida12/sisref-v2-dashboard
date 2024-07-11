"use client"

import { useRef, useState, useCallback } from "react"
import { Botao } from "../../basicos/Botao"
import { reservarRefeicao } from "@/app/actions/reservarRefeicao"
import { revalidatePath } from "next/cache"

export const Reservar = ({ meal_id, date }: { meal_id?: number, date?: string }) => {
    const mensagemDeResposta = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [reservando, setReservando] = useState(false);

    const handleReservar = useCallback(async () => {
        setReservando(true);

        mensagemDeResposta.current?.classList.remove('hidden', 'text-vermelho-400', 'text-verde-400');
        mensagemDeResposta.current?.classList.add('text-azul-400');
        mensagemDeResposta.current!.textContent = 'Reservando...';

        const resposta = await reservarRefeicao({ meal_id, date })

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

        setReservando(false);
    }, [meal_id, date, mensagemDeResposta]);

    return (
        <>
            <div ref={mensagemDeResposta} className="hidden"></div>
            <Botao variante="adicionar" texto="Reservar" onClick={handleReservar} />
        </>
    )
}
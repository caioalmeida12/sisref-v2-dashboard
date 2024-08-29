"use server"

import { cookies } from "next/headers";
import { FetchHelper } from "../lib/actions/FetchHelper";

export const cancelarRefeicao = async ({ meal_id, date }: { meal_id?: number, date?: string }) => {
    const resposta = await FetchHelper.put<unknown>({
        rota: "/login",
        cookies: cookies(),
        body: { meal_id, date },
    })

    if (!resposta.sucesso) {
        return { sucesso: false, mensagem: resposta.message };
    }

    return { sucesso: true, mensagem: "Reserva cancelada com sucesso" };
}
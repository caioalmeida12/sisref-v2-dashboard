"use server"

import { cookies } from "next/headers";
import { FetchHelper } from "../lib/actions/FetchHelper";

export const reservarRefeicao = async ({ meal_id, date }: { meal_id?: number, date?: string }) => {
    const resposta = await FetchHelper.post<unknown>({
        rota: '/student/schedulings/new',
        cookies: cookies(),
        body: { meal_id, date }
    });

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

    return { sucesso: true, mensagem: "Reserva realizada com sucesso" };
}
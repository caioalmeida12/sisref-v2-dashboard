"use server"

import { cookies } from "next/headers";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { ParseRefeicaoDoHistorico } from "../elementos/interfaces/IRefeicaoDoHistorico";
import { IRefeicao } from "../elementos/interfaces/IRefeicao";

interface IRespostaFetchTickets {
    current_page: number;
    data: IRefeicao[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

const urlPorTipoDeTicket = {
    "a-ser-utilizado": "/to-use",
    "utilizado": "/used",
    "cancelado": "/canceled",
    "nao-utilizado": "/not-used",
} as const;

export const fetchTickets = async (tipo: keyof typeof urlPorTipoDeTicket) => {
    const API_URL = `/student/schedulings${urlPorTipoDeTicket[tipo]}?page=1`;

    const resposta = await FetchHelper.get<IRespostaFetchTickets>({
        rota: API_URL,
        cookies: cookies(),
    });

    if (!resposta.sucesso) {
        return { sucesso: false, mensagem: resposta.message };
    }

    return resposta.resposta[0].data
        .map((refeicao) => ParseRefeicaoDoHistorico(refeicao))
        .flatMap((refeicao) => refeicao.success ? refeicao.data : []);
};
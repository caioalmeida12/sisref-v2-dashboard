"use server"

/**
 * Este módulo contém todas as actions relacionadas à pagina de estudante.
 */

import { cookies } from "next/headers";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { IRefeicao, IRefeicaoSchema } from "@elementos/interfaces/IRefeicao";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";
import { IBuscarRefeicoesAutorizadas } from "@elementos/interfaces/IBuscarRefeicoesAutorizadas";
import { ParseRefeicaoDoHistorico } from "@elementos/interfaces/IRefeicaoDoHistorico";
import { IJustificativaDeEstudante, justificativasPermitidas } from "@elementos/interfaces/IJustificativaDeEstudante";
import { IRelatorioDeDesperdicio } from "@elementos/interfaces/IRelatorioDeDesperdicio";
import { IInformacoesDeEstudante } from "@elementos/interfaces/IInformacoesDeEstudante";

/**
 * Busca as refeições disponíveis para o dia solicitado. Se não for passado nenhum parâmetro, a data atual será utilizada.
 * 
 * @param data Data no formato "YYYY-MM-DD"
 * @returns Um array de objetos contendo as refeições disponíveis para o dia solicitado.
 */
export async function buscarRefeicoesPorDia({ data = new Date().toISOString().split('T')[0] }: { data?: string }) {
    const resposta = await FetchHelper.get<IRefeicao>({
        rota: `/all/menus-today?date=${data}`,
        cookies: cookies(),
    })

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    const refeicoes = resposta.resposta.map((refeicao: any) => {
        // mapear o campo "meal" para o campo "refeicao" e utilizar o restante dos campos como "cardapio"
        const { meal, ...cardapio } = refeicao

        const formatar = IRefeicaoSchema.parse({
            refeicao: meal,
            cardapio: cardapio
        })

        return formatar
    })

    return refeicoes
}

/**
 * Cancela a reserva de uma refeição.
 * 
 * @param meal_id ID da refeição
 * @param date Data da refeição
 * @returns Um objeto com { sucesso: boolean, mensagem: string }
 */
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

/**
 * Busca as refeições autorizadas para o estudante.
 * 
 * @returns Um array de objetos contendo as refeições autorizadas.
 */
export async function buscarRefeicoesAutorizadas() {
    const resposta = await FetchHelper.get<IBuscarRefeicoesAutorizadas>({
        rota: `/student/schedulings/allows-meal-by-day`,
        cookies: cookies(),
    })

    if (!resposta.sucesso) return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)

    return resposta.resposta
}

interface IRespostaBuscarTickets {
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

/**
 * Busca os tickets de refeição do estudante.
 * 
 * @param tipo Tipo de ticket a ser buscado. Pode ser `a-ser-utilizado`, `utilizado`, `cancelado` ou `nao-utilizado`.
 * @returns Um array de objetos contendo os tickets de refeição.
 */
export const buscarTickets = async (tipo: keyof typeof urlPorTipoDeTicket) => {
    const API_URL = `/student/schedulings${urlPorTipoDeTicket[tipo]}?page=1`;

    const resposta = await FetchHelper.get<IRespostaBuscarTickets>({
        rota: API_URL,
        cookies: cookies(),
    });

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    return resposta.resposta[0].data
        .map((refeicao) => ParseRefeicaoDoHistorico(refeicao))
        .flatMap((refeicao) => refeicao.success ? refeicao.data : []);
};

/**
 * Busca os tickets de refeição do estudante que não possuem justificativa.
 * 
 * @returns Um array de objetos contendo os tickets de refeição.
 */
export const buscarTicketsSemJustificativa = async () => {
    const resposta = await FetchHelper.get<IRefeicao>({
        rota: '/student/schedulings/not-used-without-justification',
        cookies: cookies(),
    });

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    return resposta.resposta
        .map((refeicao) => ParseRefeicaoDoHistorico(refeicao))
        .flatMap((refeicao) => refeicao.success ? refeicao.data : []);
};

/**
 * Reserva uma refeição.
 * 
 * @param meal_id ID da refeição
 * @param date Data da refeição
 * @returns Um objeto com { sucesso: boolean, mensagem: string }
 */
export const reservarRefeicao = async ({ meal_id, date }: { meal_id?: number, date?: string }) => {
    const resposta = await FetchHelper.post<unknown>({
        rota: '/student/schedulings/new',
        cookies: cookies(),
        body: { meal_id, date }
    });

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

    return { sucesso: true, mensagem: "Reserva realizada com sucesso" };
}

/**
 * Solicita a justificativa da ausência de uma refeição.
 * 
 * @param meal_id ID da refeição
 * @param justificativa Justificativa da ausência
 * @returns Um objeto com { sucesso: boolean, mensagem: string }
 */
export const justificarRefeicao = async ({ indiceDaJustificativa, meal_id }: { indiceDaJustificativa: IJustificativaDeEstudante["value"], meal_id: number }) => {
    if (!indiceDaJustificativa) return { sucesso: false, mensagem: "Nenhuma justificativa selecionada. Selecione uma justificativa." };

    const justificativa = justificativasPermitidas.find(justificativa => justificativa.value == indiceDaJustificativa);

    if (!justificativa) {
        return { sucesso: false, mensagem: "Justificativa inválida" };
    }

    const auth = cookies().get("authorization")?.value;
    if (!auth) return redirecionarViaAction();

    const resposta = await FetchHelper.put<IRefeicao>({
        rota: `/student/schedulings/student-justification/${meal_id}`,
        cookies: cookies(),
        body: { studentJustification: justificativa.label }
    });

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

    return { sucesso: true, mensagem: "Justificativa registrada com sucesso" };
}

/**
 * Busca o relatório de desperdício de refeições.
 * 
 * @param data Data no formato "YYYY-MM-DD"
 * @returns Um objeto contendo o relatório de desperdício de refeições.
 */
export const buscarRelatorioDeDesperdicio = async ({ data }: { data: string }) => {
    const resposta = await FetchHelper.get<IRelatorioDeDesperdicio>({
        rota: `/report/list-waste?date=${data}`,
        cookies: cookies(),
    })

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    return resposta.resposta[0]
}

/**
 *  Busca as informações de estudante.
 * 
 * @param sub o sub de estudante, obtido no token decodificado
 */
export const buscarEstudante = async (sub: string): Promise<IInformacoesDeEstudante> => {
    const resposta = await FetchHelper.get<IInformacoesDeEstudante>({
        rota: `/all/show-student/${sub}`,
        cookies: cookies(),
    })

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    return resposta.resposta[0]
}
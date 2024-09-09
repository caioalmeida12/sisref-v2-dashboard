"use server"

/**
 * Este módulo contém todas as actions relacionadas à pagina de estudante.
 */

import { cookies } from "next/headers";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";
import { IBuscarRefeicoesAutorizadas } from "@/app/interfaces/IBuscarRefeicoesAutorizadas";
import { IJustificativaDeEstudante, justificativasPermitidas } from "@/app/interfaces/IJustificativaDeEstudante";
import { IRelatorioDeDesperdicio } from "@/app/interfaces/IRelatorioDeDesperdicio";
import { TEstudanteComCurso } from "../interfaces/TEstudante";
import { TRefeicao, TRefeicaoECardapioSchema } from "../interfaces/TRefeicao";
import { IRespostaPaginada } from "../interfaces/IRespostaPaginada";
import { TRefeicaoDoHistoricoSchema } from "../interfaces/TRefeicaoDoHistorico";

/**
 * Busca as refeições disponíveis para o dia solicitado. Se não for passado nenhum parâmetro, a data atual será utilizada.
 * 
 * @param data Data no formato "YYYY-MM-DD"
 * @returns Um array de objetos contendo as refeições disponíveis para o dia solicitado.
 */
export async function buscarRefeicoesPorDia({ data = new Date().toISOString().split('T')[0] }: { data?: string }) {
    const resposta = await FetchHelper.get<TRefeicao>({
        rota: `/all/menus-today?date=${data}`,
        cookies: cookies(),
    })

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    const refeicoes = resposta.resposta.map((refeicao: any) => {
        // mapear o campo "meal" para o campo "refeicao" e utilizar o restante dos campos como "cardapio"
        const { meal, ...menu } = refeicao

        const formatar = TRefeicaoECardapioSchema.parse({
            refeicao: meal,
            cardapio: menu
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

    const resposta = await FetchHelper.get<IRespostaPaginada<unknown>>({
        rota: API_URL,
        cookies: cookies(),
    });

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    return resposta.resposta[0].data
        .map((refeicao) => TRefeicaoDoHistoricoSchema.safeParse(refeicao))
        .flatMap((refeicao) => refeicao.success ? refeicao.data : []);
};

/**
 * Busca os tickets de refeição do estudante que não possuem justificativa.
 * 
 * @returns Um array de objetos contendo os tickets de refeição.
 */
export const buscarTicketsSemJustificativa = async () => {
    const resposta = await FetchHelper.get<TRefeicao>({
        rota: '/student/schedulings/not-used-without-justification',
        cookies: cookies(),
    });

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    return resposta.resposta
        .map((refeicao) => TRefeicaoDoHistoricoSchema.safeParse(refeicao))
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

    const resposta = await FetchHelper.put<TRefeicao>({
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
 * @returns Um objeto contendo as informações de estudante com curso incluso.
 */
export const buscarEstudante = async (sub: string): Promise<TEstudanteComCurso> => {
    const resposta = await FetchHelper.get<TEstudanteComCurso>({
        rota: `/all/show-student/${sub}`,
        cookies: cookies(),
    })

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    return resposta.resposta[0]
}
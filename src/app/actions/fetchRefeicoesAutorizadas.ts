"use server"

import { cookies } from "next/headers"
import { IFetchRefeicoesAutorizadas } from "../elementos/interfaces/IFetchRefeicoesAutorizadas"
import { FetchHelper } from "../lib/actions/FetchHelper"
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction"

/**
 * Realiza uma chamada assíncrona para a API de refeições autorizadas.
 * 
 * @redirects fail - Para a página de login com uma mensagem de erro caso haja algum problema.
 */
export async function fetchRefeicoesAutorizadas() {
    const resposta = await FetchHelper.get<IFetchRefeicoesAutorizadas>({
        rota: `/student/schedulings/allows-meal-by-day`,
        cookies: cookies(),
    })

    if (!resposta.sucesso) return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)

    return resposta.resposta
}
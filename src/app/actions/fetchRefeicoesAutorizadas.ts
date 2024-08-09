"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"
import { IFetchRefeicoesAutorizadas } from "../elementos/interfaces/IFetchRefeicoesAutorizadas"

// [ 'Erro 401' ]
const respostaFoiErroDeAutenticacao = (resposta: any) => resposta[0] === 'Erro 401'

/**
 * Realiza uma chamada assíncrona para a API de refeições autorizadas.
 * 
 * @redirects fail - Para a página de login com uma mensagem de erro caso haja algum problema.
 */
export async function fetchRefeicoesAutorizadas() {
    const API_URL = `${process.env.URL_BASE_API}/student/schedulings/allows-meal-by-day`

    const resposta = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies().get('authorization')?.value}`
        },
    })
        .then(resposta => resposta.json())
        // Erro ao conectar com a API
        .catch(erro => redirect(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(erro.status))}`))

    // Erro durante a autenticação
    if (respostaFoiErroDeAutenticacao(resposta)) return redirect(`/login?erro=${encodeURIComponent(resposta.message)}`)

    // Autenticado com sucesso
    const refeicoes: IFetchRefeicoesAutorizadas[] = resposta

    return refeicoes
}
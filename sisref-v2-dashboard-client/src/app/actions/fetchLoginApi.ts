"use server"

import { cookies } from "next/headers"
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction"
import { redirect } from "next/navigation"
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"

interface IInformacoesLogin {
    access_token: string
    token_type: string
    id: number
    classfication: 'STUDENT'
    name: string
    campus: number
    active: number
    expires_in: number
}

const respostaFoiErroDeAutenticacao = (resposta: unknown): resposta is { message: string } => (resposta as { message: string }).message !== undefined

/**
 * Realiza uma chamada assíncrona para a API de login.
 * 
 * @param formData - Os dados do formulário de login.
 * @redirects success - Para a página inicial do sistema.
 * @redirects fail - Para a página de login com uma mensagem de erro caso haja algum problema.
 */
export async function fetchLoginAPI(formData: FormData) {
    const API_URL = "https://ruapi.cedro.ifce.edu.br/api/login"

    const resposta = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password')
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(resposta => resposta.json())
        // Erro ao conectar com a API
        .catch(erro => redirect(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(erro.status))}`))

    // Erro durante a autenticação
    if (respostaFoiErroDeAutenticacao(resposta)) return redirect(`/login?erro=${encodeURIComponent(resposta.message)}`)

    // Autenticado com sucesso
    const informacoesLogin: IInformacoesLogin = { ...resposta }

    cookies().set("authorization", `Bearer ${informacoesLogin.access_token}`)
    cookies().set("classification", informacoesLogin.classfication)

    return redirecionarViaAction("/")
}
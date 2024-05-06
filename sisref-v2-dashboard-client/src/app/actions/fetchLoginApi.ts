"use server"

import { cookies } from "next/headers"
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction"
import { redirect } from "next/navigation"

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

    const data = await resposta.json()

    // Erro ao autenticar
    if (typeof data.access_token == "undefined") return redirect(`/login?erro=${encodeURIComponent(data.message)}`)

    // Autenticado com sucesso
    const informacoesLogin: IInformacoesLogin = { ...data }

    cookies().set("authorization", `Bearer ${informacoesLogin.access_token}`)
    cookies().set("classification", informacoesLogin.classfication)

    return redirecionarViaAction("/")
}
"use server"

import { cookies } from "next/headers"
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction"
import { ParseRefeicaoDoHistorico } from "../elementos/interfaces/IRefeicaoDoHistorico"

export const fetchTicketsSemJustificativa = async () => {
    const API_URL = new URL(`${process.env.URL_BASE_API}/student/schedulings/not-used-without-justification`)

    const auth = cookies().get("authorization")?.value
    if (!auth) return redirecionarViaAction()

    const resposta = await fetch(`${API_URL}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        }
    })

    if (resposta.status === 401) return redirecionarViaAction()

    const refeicoes: any[] = await resposta.json()

    return refeicoes
        .map((refeicao) => ParseRefeicaoDoHistorico(refeicao))
        .flatMap((refeicao) => refeicao.success ? refeicao.data : [])
}
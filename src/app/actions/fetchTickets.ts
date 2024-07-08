"use server"

import { cookies } from "next/headers"
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction"
import { IRefeicaoDoHistorico } from "../elementos/interfaces/IRefeicaoDoHistorico"

const urlPorTipoDeTicket = {
    "a-ser-utilizado": "/to-use",
    "utilizado": "/used",
    "cancelado": "/canceled",
    "nao-utilizado": "/not-used",
} as const

export const fetchTickets = async (tipo: keyof typeof urlPorTipoDeTicket) => {
    const API_URL = new URL(`https://ruapi.cedro.ifce.edu.br/api/student/schedulings${urlPorTipoDeTicket[tipo]}?page=1`)

    const auth = cookies().get("authorization")?.value
    if (!auth) return redirecionarViaAction()

    const resposta = await fetch(`${API_URL}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        }
    })

    if (resposta.status === 401) return redirecionarViaAction()

    const refeicoes = await resposta.json()

    const data = refeicoes.data

    const array = Array.isArray(data) ? data : [data];

    return array.map((refeicao) => ({
        turno: refeicao.meal_id as 1 | 2 | 3 | 4,
        cardapio: refeicao.menu,
        refeicao: refeicao.meal,
    })) as IRefeicaoDoHistorico[]
}
"use server"

import { cookies } from "next/headers";

import { IRefeicao } from "../elementos/interfaces/IRefeicao";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";

export async function fetchRefeicoesPorDia({ data = new Date().toISOString().split('T')[0] }: { data?: string }) {
    const API_URL = new URL("https://ruapi.cedro.ifce.edu.br/api/all/menus-today")
    API_URL.searchParams.append('date', data);

    const auth = cookies().get("authorization")?.value
    if (!auth) return redirecionarViaAction()

    const resposta = await fetch(`${API_URL}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        }
    })

    const refeicoes = await resposta.json();

    const array = Array.isArray(refeicoes) ? refeicoes : [refeicoes];

    return array as IRefeicao[]
}
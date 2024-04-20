"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { IRefeicao } from "../elementos/interfaces/IRefeicao";

export async function fetchRefeicoesPorDia({ data = new Date().toISOString().split('T')[0] }: { data?: string }) {
    const API_URL = new URL("https://ruapi.cedro.ifce.edu.br/api/all/menus-today")
    API_URL.searchParams.append('date', data);

    const resposta = await fetch(`${API_URL}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": cookies().get("authorization")?.value || redirect("/login")
        }
    });

    const refeicoes = await resposta.json();

    const array = Array.isArray(refeicoes) ? refeicoes : [refeicoes];

    return array as IRefeicao[]
}
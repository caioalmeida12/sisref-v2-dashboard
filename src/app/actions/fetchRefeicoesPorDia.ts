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

    return mockRefeicoes
}

const mockRefeicoes: IRefeicao[] = [
    {
        turno: 1,
        refeicao: {
            id: 1,
            description: "Café da manhã",
            qtdTimeReservationEnd: 10,
            qtdTimeReservationStart: 6,
            timeEnd: "09:00",
            timeStart: "07:00",
        },
        cardapio: {
            agendado: true,
            date: "2023-04-01",
            description: "Pão + café com leite",
            permission: true,
            id: 101,
            campus_id: 1,
        },
    },
    {
        turno: 2,
        refeicao: {
            id: 2,
            description: "Almoço",
            qtdTimeReservationEnd: 14,
            qtdTimeReservationStart: 10,
            timeEnd: "13:00",
            timeStart: "11:00",
        },
        cardapio: {
            agendado: true,
            date: "2023-04-01",
            description: "Arroz parbolizado; feijão mulatinho; carne de porco frita; salada; suco",
            permission: true,
            id: 102,
            campus_id: 1,
        },
    },
    {
        turno: 3,
        refeicao: {
            id: 3,
            description: "Jantar",
            qtdTimeReservationEnd: 19,
            qtdTimeReservationStart: 15,
            timeEnd: "18:00",
            timeStart: "17:00",
        },
        cardapio: {
            agendado: true,
            date: "2023-04-01",
            description: "Sopa; pão; chá",
            permission: true,
            id: 103,
            campus_id: 1,
        },
    },
    {
        turno: 4,
        refeicao: {
            id: 4,
            description: "Ceia",
            qtdTimeReservationEnd: 22,
            qtdTimeReservationStart: 19,
            timeEnd: "21:00",
            timeStart: "20:00",
        },
        cardapio: {
            agendado: false,
            date: "2023-04-01",
            description: "Chá; biscoitos",
            permission: false,
            id: 104,
            campus_id: 1,
        },
    }
]
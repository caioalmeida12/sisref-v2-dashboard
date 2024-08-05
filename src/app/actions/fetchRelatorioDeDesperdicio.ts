"use server"

import { IRelatorioDeDesperdicio } from "@/app/elementos/interfaces/IRelatorioDeDesperdicio"
import { cookies } from "next/headers"
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction"

export const fetchRelatorioDeDesperdicio = async ({ data }: { data: string }) => {
    const auth = cookies().get("authorization")?.value

    if (!auth) return redirecionarViaAction()

    const fetchRelatorio = await fetch(`https://ruapi.cedro.ifce.edu.br/api/report/list-waste?date=${data}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth}`
        }
    })

    if (!fetchRelatorio.ok) return null

    const resposta = await fetchRelatorio.json()

    return resposta as IRelatorioDeDesperdicio
}
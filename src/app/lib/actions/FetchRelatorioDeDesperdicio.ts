"use server"

import { IRelatorioDeDesperdicio } from "@/app/elementos/interfaces/IRelatorioDeDesperdicio"
import { cookies } from "next/headers"
import { redirecionarViaAction } from "./RedirecionarViaAction"

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

    const resposta = await fetchRelatorio.json()

    if (!fetchRelatorio.ok) return null
    
    return resposta as IRelatorioDeDesperdicio
}
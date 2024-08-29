"use server"

import { IRelatorioDeDesperdicio } from "@/app/elementos/interfaces/IRelatorioDeDesperdicio"
import { cookies } from "next/headers"
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction"
import { FetchHelper } from "../lib/actions/FetchHelper"

export const fetchRelatorioDeDesperdicio = async ({ data }: { data: string }) => {
    const resposta = await FetchHelper.get<IRelatorioDeDesperdicio>({
        rota: `/report/list-waste?date=${data}`,
        cookies: cookies(),
    })

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    return resposta.resposta[0]
}
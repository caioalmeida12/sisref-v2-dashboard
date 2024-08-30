import { IInformacoesDoCampus } from "@/app/elementos/interfaces/IInformacoesDoCampus";
import { cookies } from "next/headers";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";
import { FetchHelper } from "../lib/actions/FetchHelper";

export const buscarCampus = async (id: string) => {
    const resposta = await FetchHelper.get<IInformacoesDoCampus>({
        rota: `/all/campus/`,
        cookies: cookies(),
    })

    if (!resposta.sucesso) return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)

    return resposta.resposta.find((campus) => campus.id === Number(id)) || { id: 0, description: "Campus não encontrado" }
};

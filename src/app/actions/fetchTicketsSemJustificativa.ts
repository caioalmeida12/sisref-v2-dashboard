"use server"

import { cookies } from "next/headers";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { ParseRefeicaoDoHistorico } from "../elementos/interfaces/IRefeicaoDoHistorico";
import { IRefeicao } from "../elementos/interfaces/IRefeicao";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";

export const fetchTicketsSemJustificativa = async () => {
    const resposta = await FetchHelper.get<IRefeicao>({
        rota: '/student/schedulings/not-used-without-justification',
        cookies: cookies(),
    });

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    return resposta.resposta
        .map((refeicao) => ParseRefeicaoDoHistorico(refeicao))
        .flatMap((refeicao) => refeicao.success ? refeicao.data : []);
};
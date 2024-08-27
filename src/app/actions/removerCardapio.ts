"use server"

import { cookies } from "next/headers";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP";

export const removerCardapio = async ({ meal_id }: { meal_id?: number }) => {
    if (!meal_id) return { sucesso: false, mensagem: "ID do cardápio não informado" };

    const auth = cookies().get("authorization")?.value
    if (!auth) return redirecionarViaAction()

    const resposta = await fetch(`${process.env.URL_BASE_API}/menu/${meal_id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${auth}`,
        },
    })

    if (!resposta.ok) {
        const mensagemErro = mensagemDeErroPorCodigoHTTP(resposta.status);
        return { sucesso: false, mensagem: mensagemErro };
    }

    const json = await resposta.json();

    if (typeof json.message != "undefined") return { sucesso: false, mensagem: json.message };

    return { sucesso: true, mensagem: "Reserva cancelada com sucesso" };
}
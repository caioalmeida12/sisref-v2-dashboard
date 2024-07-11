"use server"

import { cookies } from "next/headers";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP";


export const reservarRefeicao = async ({meal_id, date}: {meal_id?: number, date?:string}) => {
    const auth = cookies().get("authorization")?.value
    if (!auth) return redirecionarViaAction()

    const resposta = await fetch("https://ruapi.cedro.ifce.edu.br/api/student/schedulings/new", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        body: JSON.stringify({
            meal_id,
            date
        }),
        method: "POST"
    })

    if (!resposta.ok) {
        const mensagemErro = mensagemDeErroPorCodigoHTTP(resposta.status);
        return { sucesso: false, mensagem: mensagemErro };
    }

    const json = await resposta.json();

    if (typeof json.message != "undefined") return { sucesso: false, mensagem: json.message };

    return { sucesso: true, mensagem: "Reserva realizada com sucesso" };
}
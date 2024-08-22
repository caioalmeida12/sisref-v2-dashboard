"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"
import { IRefeicao, IRefeicaoSchema } from "../elementos/interfaces/IRefeicao"

// [ 'Erro 401' ]
const respostaFoiErroDeAutenticacao = (resposta: any) => resposta[0] === 'Erro 401'

// Esta função precisa de uma data no formato yyyy-MM-dd
export async function fetchTabelaDeRefeicoesNutricionista({ campus_id, date }: { campus_id: number, date: string }) {
    const API_URL = `${process.env.URL_BASE_API}/menu/all-by-date?campus_id=${campus_id}&date=${date}`

    const resposta = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies().get('authorization')?.value}`
        },
    })
        .then(resposta => resposta.json())
        // Erro ao conectar com a API
        .catch(erro => redirect(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(erro.status))}`)
        )

    // Erro durante a autenticação
    if (respostaFoiErroDeAutenticacao(resposta)) return redirect(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(401))}`)

    const refeicoesFormatadas: IRefeicao[] = resposta.map((menu: any) => {
        const { meal, ...cardapio } = menu

        const formatar = IRefeicaoSchema.parse({
            refeicao: meal,
            cardapio: {
                ...cardapio,
                agendado: false
            }
        })

        return formatar
    })

    return refeicoesFormatadas
}
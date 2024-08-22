"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"
import { IRefeicao } from "../elementos/interfaces/IRefeicao"

// [ 'Erro 401' ]
const respostaFoiErroDeAutenticacao = (resposta: any) => resposta[0] === 'Erro 401'

// export async function fetchNomesDeRefeicoesNutricionista({ dataInicial, dataFinal }: { dataInicial: string, dataFinal: string }) {
export async function fetchNomesDeRefeicoesNutricionista() {
    const API_URL = `${process.env.URL_BASE_API}/meal`

    const resposta = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies().get('authorization')?.value}`
        },
    })
        .then(resposta => resposta.json() as Promise<{
            current_page: number,
            data: IRefeicao["refeicao"][],
        }>)
        // Erro ao conectar com a API
        .catch(erro => redirect(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(erro.status))}`))

    // Erro durante a autenticação
    if (respostaFoiErroDeAutenticacao(resposta)) return redirect(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(401))}`)

    return resposta.data
}

"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"
import { IRefeicao } from "../elementos/interfaces/IRefeicao"

// [ 'Erro 401' ]
const respostaFoiErroDeAutenticacao = (resposta: any) => resposta[0] === 'Erro 401'

/**
 * Realiza uma chamada assíncrona para a API que busca todas as refeições disponíveis.
 * 
 * @redirects success - Para a página do cardápio com as refeições disponíveis.
 * @redirects fail - Para a página de erro com uma mensagem de erro caso haja algum problema.
 */
export async function fetchRefeicoesParaCardapio() {
    const API_URL = "https://ruapi.cedro.ifce.edu.br/api/meal/all"

    const resposta = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${cookies().get("authorization")}`,
        },
    })
        .then(resposta => resposta.json())
        // Erro ao conectar com a API
        .catch(erro => redirect(`/erro?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(erro.status))}`))

    // Erro durante a busca de refeições
    if (respostaFoiErroDeAutenticacao(resposta)) return redirect(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(401))}`)

    // Refeições buscadas com sucesso
    const informacoesRefeicoes: IRefeicao["refeicao"][] = resposta.map((refeicao: any) => ({
        id: refeicao.id,
        nome: refeicao.nome,
        descricao: refeicao.descricao,
        disponivel: refeicao.disponivel,
        data: refeicao.data,
    }))

    return informacoesRefeicoes
}
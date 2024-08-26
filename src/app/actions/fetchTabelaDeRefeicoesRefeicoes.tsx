"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"
import { IRefeicao, IRefeicaoSchema } from "../elementos/interfaces/IRefeicao"

// [ 'Erro 401' ]
const respostaFoiErroDeAutenticacao = (resposta: any) => resposta[0] === 'Erro 401'

// Função para formatar a resposta da API
const formatarRefeicao = (menu: any) => {
    const { meal, ...cardapio } = menu;

    const formatar = IRefeicaoSchema.safeParse({
        refeicao: meal,
        cardapio: {
            ...cardapio,
            agendado: false
        }
    });

    return formatar.success ? formatar.data : [];
};

// Esta função precisa de uma data no formato yyyy-MM-dd
export async function fetchTabelaDeRefeicoesNutricionista({ campus_id, date, refeicoes_disponiveis }: { campus_id: number, date: string, refeicoes_disponiveis: IRefeicao["refeicao"][] }): Promise<IRefeicao[]> {
    const API_URL = `${process.env.URL_BASE_API}/menu/all-by-date?campus_id=${campus_id}&date=${date}`

    const resposta = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies().get('authorization')?.value}`
        },
    })
        .then(resposta => resposta.json() as Promise<IRefeicao["refeicao"][]>)
        // Erro ao conectar com a API
        .catch(erro => redirect(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(erro.status))}`)
        )

    // Erro durante a autenticação
    // if (respostaFoiErroDeAutenticacao(resposta)) return redirect(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(401))}`)

    // Formata a resposta da API
    const refeicoesFormatadas: IRefeicao[] = resposta.flatMap(formatarRefeicao);

    // Pode ocorrer de entre as refeições disponíveis, algumas não estarem cadastradas ainda. Ex: o lanche da tarde do dia em questão não foi preenchido ainda.
    // Nesse caso, é necessário retornar todas as refeições disponíveis, mesmo que algumas não tenham sido cadastradas, para que a pessoa nutricionista possa preencher.
    const todasAsRefeicoes = refeicoes_disponiveis.map(refeicao => {
        const refeicaoEncontrada = refeicoesFormatadas.find(refeicaoFormatada => refeicaoFormatada.refeicao?.id === refeicao?.id);

        return refeicaoEncontrada ? refeicaoEncontrada : {
            refeicao,
            cardapio: {
                agendado: false,
                description: "Não cadastrado",
                campus_id,
                date,
                id: 0,
                permission: false,
            }
        };
    });

    return todasAsRefeicoes

}
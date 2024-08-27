"use server"

import { cookies } from "next/headers";
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"

interface ErroDeAutenticacao {
    message: string;
}

const respostaFoiErroDeAutenticacao = (resposta: unknown): resposta is ErroDeAutenticacao => {
    return typeof resposta === 'object' && resposta !== null && 'message' in resposta;
}

/**
 * Realiza uma chamada assíncrona para a API de criação de cardápio.
 * 
 * @param formData - Os dados do formulário de criação de cardápio.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function criarCardapio(formData: FormData) {
    const API_URL = `${process.env.URL_BASE_API}/menu`

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                description: formData.get('description'),
                date: formData.get('date'),
                meal_id: formData.get('meal_id')
            }),
            headers: {
                'Authorization': `Bearer ${cookies().get("authorization")?.value}`,
                'Content-Type': 'application/json'
            },
        });

        if (!resposta.ok) {
            const mensagemErro = mensagemDeErroPorCodigoHTTP(resposta.status);
            return { sucesso: false, mensagem: mensagemErro };
        }

        const json = await resposta.json();

        // Verifica se a resposta é um erro de autenticação
        if (respostaFoiErroDeAutenticacao(json)) {
            return { sucesso: false, mensagem: json.message };
        }

        // Quando um campo é enviado mal formatado, a API retorna o seguinte tipo de dado, ao invés de erro (por algum motivo desconhecido)
        /**
         * {
            description: [ 'A descrição é obrigatória' ],
            date: [ 'A data é obrigatória' ],
            meal_id: [ 'A refeição é obrigatória' ]
            }   
         */

        if (Array.isArray(json.description)) return { sucesso: false, mensagem: json.description[0] }
        if (Array.isArray(json.date)) return { sucesso: false, mensagem: json.date[0] }
        if (Array.isArray(json.meal_id)) return { sucesso: false, mensagem: json.meal_id[0] }

        // Sucesso na criação do cardápio
        return { sucesso: true, mensagem: "Cardápio criado com sucesso." };

    } catch (erro) {
        let mensagemErro = "Ocorreu um erro desconhecido.";
        if (erro instanceof Error) {
            mensagemErro = erro.message;
        }
        return { sucesso: false, mensagem: mensagemErro };
    }
}
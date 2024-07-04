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
    const API_URL = "https://ruapi.cedro.ifce.edu.br/api/menu"

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

        const data = await resposta.json();

        // Verifica se a resposta é um erro de autenticação
        if (respostaFoiErroDeAutenticacao(data)) {
            return { sucesso: false, mensagem: data.message };
        }

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
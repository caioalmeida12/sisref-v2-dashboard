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
 * Realiza uma chamada assíncrona para a API de criação de relatórios de desperdício.
 * 
 * @param formData - Os dados do formulário de criação de relatório de desperdício.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function criarRelatorioDeDesperdicio(formData: FormData) {
    const API_URL = "https://ruapi.cedro.ifce.edu.br/api/report/add-waste-report"

    try {
        const resposta = await fetch(API_URL, {
            method: 'PUT',
            body: JSON.stringify({
                date: formData.get('date'),
                content: formData.get('content'),
            }),
            headers: {
                'Authorization': `Bearer ${cookies().get("authorization")?.value}`,
                "content-type": "application/json",
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

        // Sucesso na criação do relatório de desperdício
        return { sucesso: true, mensagem: "Relatório de desperdício criado com sucesso." };

    } catch (erro) {
        let mensagemErro = "Ocorreu um erro desconhecido.";
        if (erro instanceof Error) {
            mensagemErro = erro.message;
        }
        return { sucesso: false, mensagem: mensagemErro };
    }
}
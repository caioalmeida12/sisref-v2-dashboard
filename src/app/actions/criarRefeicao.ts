"use server"

import { cookies } from "next/headers";
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"
import { IRefeicaoSchema } from "../elementos/interfaces/IRefeicao";

interface ErroDeAutenticacao {
    message: string;
}

const respostaFoiErroDeAutenticacao = (resposta: unknown): resposta is ErroDeAutenticacao => {
    return typeof resposta === 'object' && resposta !== null && 'message' in resposta;
}

/**
 * Realiza uma chamada assíncrona para a API de criação de refeição.
 * 
 * @param formData - Os dados do formulário de criação de refeição.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function criarRefeição(formData: FormData) {
    const API_URL = `${process.env.URL_BASE_API}/meal`

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

        if (respostaFoiErroDeAutenticacao(await resposta.json())) {
            return { sucesso: false, mensagem: mensagemDeErroPorCodigoHTTP(401) };
        }

        const formatar = IRefeicaoSchema.pick({ refeicao: true }).safeParse(await resposta.json());

        if (!formatar.success || !formatar.data) {
            return { sucesso: false, mensagem: "Erro ao criar refeição." };
        }

        // Quando a refeição possui campos inválidos, a API retorna o seguinte objeto:
        // {
        //   description: [ 'A descrição é obrigatória' ],
        //   qtdTimeReservationEnd: [
        //     'A quantidade de horas do fim da reserva antes do horário da refeição deve ser informada'
        //   ],
        //   qtdTimeReservationStart: [
        //     'A quantidade de horas do início da reserva antes do horário da refeição deve ser informada'
        //   ],
        //   timeEnd: [ 'Hora de fim da refeição é obrigatória' ],
        //   timeStart: [ 'Hora de início da refeição é obrigatória' ]
        // }

        // Quando o zod passa essa validação, ele retorna um objeto com a propriedade `success` definida como `true` e a propriedade `data` contendo {}.
        // É preciso, então, verificar se o objeto retornado é vazio, e caso seja, retornar um objeto com a propriedade `success` definida como `false` e a propriedade `mensagem` contendo a mensagem de erro.

        const { data: refeicao } = formatar;


        const camposParaValidar = ["description", "qtdTimeReservationEnd", "qtdTimeReservationStart", "timeEnd", "timeStart"] as const;
        const camposInvalidos = camposParaValidar.filter(campo => refeicao.refeicao![campo]);

        if (camposInvalidos.length) {
            return { sucesso: false, mensagem: `Os campos ${camposInvalidos.join(', ')} são obrigatórios.` };
        }

        return { sucesso: true, mensagem: "Refeição criada com sucesso." };

    } catch (erro) {
        let mensagemErro = "Ocorreu um erro desconhecido.";
        if (erro instanceof Error) {
            mensagemErro = erro.message;
        }
        return { sucesso: false, mensagem: mensagemErro };
    }
}
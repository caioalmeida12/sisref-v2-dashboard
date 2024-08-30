"use server"

/**
 * Este módulo contém todas as actions relacionadas à página de nutricionista.
 */

import { cookies } from "next/headers";
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"
import { IRefeicaoSchema } from "../elementos/interfaces/IRefeicao";
import { FetchHelper } from "../lib/actions/FetchHelper";

/**
 * Cria uma refeição.
 * 
 * @param formData - Os dados do formulário de criação de refeição.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function criarRefeição(formData: FormData) {
    const resposta = await FetchHelper.post<unknown>({
        rota: "/meal",
        cookies: cookies(),
        body: {
            description: formData.get('description'),
            date: formData.get('date'),
            meal_id: formData.get('meal_id')
        }
    })

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

    const formatar = IRefeicaoSchema.pick({ refeicao: true }).safeParse(resposta.resposta[0]);

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
}

/**
 * Cria um cardápio.
 * 
 * @param formData - Os dados do formulário de criação de cardápio.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function criarCardapio(formData: FormData) {
    const resposta = await FetchHelper.post<unknown>({
        rota: "/menu",
        cookies: cookies(),
        body: {
            description: formData.get('description'),
            date: formData.get('date'),
            meal_id: formData.get('meal_id')
        }
    })

    if (!resposta.sucesso) {
        return { sucesso: false, mensagem: resposta.message };
    }

    // Quando um campo é enviado mal formatado, a API retorna o seguinte tipo de dado, ao invés de erro (por algum motivo desconhecido)
    /**
     * {
        description: [ 'A descrição é obrigatória' ],
        date: [ 'A data é obrigatória' ],
        meal_id: [ 'A refeição é obrigatória' ]
        }   
     */
    if (Array.isArray(resposta.resposta) && typeof resposta.resposta[0] === 'object' && resposta.resposta[0] !== null) {
        const primeiro_erro = resposta.resposta[0] as { [key: string]: unknown };

        if ("description" in primeiro_erro && Array.isArray(primeiro_erro.description)) {
            return { sucesso: false, mensagem: primeiro_erro.description[0] };
        }
        if ("date" in primeiro_erro && Array.isArray(primeiro_erro.date)) {
            return { sucesso: false, mensagem: primeiro_erro.date[0] };
        }
        if ("meal_id" in primeiro_erro && Array.isArray(primeiro_erro.meal_id)) {
            return { sucesso: false, mensagem: primeiro_erro.meal_id[0] };
        }
    }

    return { sucesso: true, mensagem: "Cardápio criado com sucesso." };
}


/**
 * Realiza uma chamada assíncrona para a API de edição de cardápio.
 * 
 * @param formData - Os dados do formulário de criação de cardápio.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function editarCardapio(formData: FormData) {
    const resposta = await FetchHelper.put<unknown>({
        rota: `/menu/${formData.get('menu_id')}`,
        cookies: cookies(),
        rotaParaRedirecionarCasoFalhe: null,
        body: {
            description: formData.get('description'),
            date: formData.get('date'),
            meal_id: formData.get('meal_id')
        },
    });

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };


    // Quando um campo é enviado mal formatado, a API retorna o seguinte tipo de dado, ao invés de erro (por algum motivo desconhecido)
    /**
     * {
        description: [ 'A descrição é obrigatória' ],
        date: [ 'A data é obrigatória' ],
        meal_id: [ 'A refeição é obrigatória' ]
        }   
     */
    if (Array.isArray(resposta.resposta) && typeof resposta.resposta[0] === 'object' && resposta.resposta[0] !== null) {
        const primeiro_erro = resposta.resposta[0] as { [key: string]: unknown };

        if ("description" in primeiro_erro && Array.isArray(primeiro_erro.description)) {
            return { sucesso: false, mensagem: primeiro_erro.description[0] };
        }
        if ("date" in primeiro_erro && Array.isArray(primeiro_erro.date)) {
            return { sucesso: false, mensagem: primeiro_erro.date[0] };
        }
        if ("meal_id" in primeiro_erro && Array.isArray(primeiro_erro.meal_id)) {
            return { sucesso: false, mensagem: primeiro_erro.meal_id[0] };
        }
    }

    return { sucesso: true, mensagem: "Cardápio editado com sucesso." };
}
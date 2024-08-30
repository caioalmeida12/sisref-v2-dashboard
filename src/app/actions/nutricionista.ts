"use server"

/**
 * Este módulo contém todas as actions relacionadas à página de nutricionista.
 */

import { cookies } from "next/headers";
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"
import { IRefeicao, IRefeicaoSchema } from "../elementos/interfaces/IRefeicao";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";
import { redirect } from "next/navigation";

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

/**
 * Realiza uma chamada assíncrona para a API de edição de refeição.
 * 
 * @param formData - Os dados do formulário de criação de cardápio.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export const removerCardapio = async ({ meal_id }: { meal_id?: number }) => {
    if (!meal_id) return { sucesso: false, mensagem: "ID do cardápio não informado" };

    const resposta = await FetchHelper.delete<{ message: string }>({
        rota: `/menu/${meal_id}`,
        cookies: cookies(),
        rotaParaRedirecionarCasoFalhe: null,
    });

    // Se a resposta for erro e a mensagem for "O cardápio foi excluído.", retornar sucesso.
    if (!resposta.sucesso && resposta.message == "O cardápio foi excluído.") {
        return { sucesso: true, mensagem: resposta.message };
    }

    if (!resposta.sucesso) {
        return { sucesso: false, mensagem: resposta.message };
    }

    // Retornar mensagem de erro genérica se a mensagem não for "O cardápio foi excluído."
    return { sucesso: false, mensagem: resposta.resposta[0].message };
}

/**
 *  Formata a refeição para o formato esperado pelo front-end.
 * 
 * @param menu - O a refeição da maneira que é retornada pela API.
 * @returns A refeição formatada para o formato esperado pelo front-end.
 */
const formatarRefeicaoDoBackendParaOFrontend = (menu: unknown) => {
    if (!(typeof menu === "object")) return [];
    if (menu === null) return [];
    if (!("meal" in menu)) return [];

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

/**
 *  Busca as refeições de um determinado campus para uma determinada data.
 */
export async function buscarTabelaDeCardapios({ campus_id, data, refeicoes_disponiveis }: { campus_id: number, data: string, refeicoes_disponiveis: IRefeicao["refeicao"][] }) {
    const resposta = await FetchHelper.get<IRefeicao["refeicao"][]>({
        rota: `/menu/all-by-date?campus_id=${campus_id}&date=${data}`,
        cookies: cookies(),
        rotaParaRedirecionarCasoFalhe: null,
    });

    if (!resposta.sucesso) {
        return { sucesso: false, mensagem: resposta.message };
    }


    // Formata a resposta da API
    const refeicoesFormatadas: IRefeicao[] = resposta.resposta.flatMap(formatarRefeicaoDoBackendParaOFrontend);

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
                date: data,
                id: 0,
                permission: false,
            }
        };
    });

    return {
        sucesso: true,
        resposta: todasAsRefeicoes
    };
}

/**
 * Realiza uma chamada assíncrona para a API que busca todas as refeições disponíveis.
 */
export async function buscarRefeicoes() {
    const resposta = await FetchHelper.get<IRefeicao["refeicao"][]>({
        rota: "/meal/all",
        cookies: cookies(),
        rotaParaRedirecionarCasoFalhe: null,
    });

    if (!resposta.sucesso) {
        return {
            sucesso: false,
            mensagem: resposta.message
        }
    }

    // Refeições buscadas com sucesso
    const refeicoes: IRefeicao["refeicao"][] = resposta.resposta.map((refeicao: any) => ({
        id: refeicao.id,
        description: refeicao.description,
        qtdTimeReservationEnd: refeicao.qtdTimeReservationEnd,
        qtdTimeReservationStart: refeicao.qtdTimeReservationStart,
        timeEnd: refeicao.timeEnd,
        timeStart: refeicao.timeStart
    }))

    return {
        sucesso: true,
        resposta: refeicoes
    }
}

/**
 * Realiza uma chamada assíncrona para a API de criação de relatórios de desperdício.
 * 
 * @param formData - Os dados do formulário de criação de relatório de desperdício.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function criarRelatorioDeDesperdicio(formData: FormData) {
    const resposta = await FetchHelper.post<unknown>({
        rota: "/report/add-waste-report",
        cookies: cookies(),
        body: {
            date: formData.get('date'),
            content: formData.get('content')
        }
    });

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

    return { sucesso: true, mensagem: "Relatório de desperdício criado com sucesso." };
}

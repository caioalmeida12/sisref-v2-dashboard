"use server"

/**
 * Este módulo contém todas as actions relacionadas à página de nutricionista.
 */

import { cookies } from "next/headers";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { IRespostaPaginada } from "@/app/interfaces/IRespostaPaginada";
import { TAgendamento, TAgendamentoSchema } from "@/app/interfaces/TAgendamento";
import { IRelatorioDeDesperdicio } from "../interfaces/IRelatorioDeDesperdicio";
import { TCardapio, TRefeicao, TRefeicaoECardapio, TRefeicaoECardapioSchema, TRefeicaoSchema } from "../interfaces/TRefeicao";
import { TRelatorioDeRefeicoes } from "../interfaces/TRelatorioDeRefeicoes";
import { IRespostaDeAction } from "../interfaces/IRespostaDeAction";

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

    const formatar = TRefeicaoSchema.safeParse(resposta.resposta[0]);

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
    const camposInvalidos = camposParaValidar.filter(campo => refeicao[campo]);

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
        rotaParaRedirecionarCasoFalhe: null,
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
export const removerCardapio = async ({ menu_id }: { menu_id?: number }) => {
    if (!menu_id) return { sucesso: false, mensagem: "ID do cardápio não informado" };

    const resposta = await FetchHelper.delete<{ message: string }>({
        rota: `/menu/${menu_id}`,
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
const formatarRefeicaoDoBackendParaOFrontend = (menu: any) => {
    if (!menu?.meal) return [];

    const { meal, ...cardapio } = menu;

    const formatar = TRefeicaoECardapioSchema.safeParse({
        meal,
        menu: {
            ...cardapio,
            agendado: false,
            permission: 1
        } satisfies TCardapio
    });

    return formatar.success ? formatar.data : [];
};

/**
 *  Busca as refeições de um determinado campus para uma determinada data.
 */
export async function buscarTabelaDeCardapios({ campus_id, data, refeicoes_disponiveis }: { campus_id: number, data: string, refeicoes_disponiveis?: TRefeicao[] }): Promise<{ sucesso: false, mensagem: string } | { sucesso: true, resposta: TRefeicaoECardapio[] }> {
    if (!refeicoes_disponiveis?.length) {
        return { sucesso: false, mensagem: "Refeições disponíveis não foram fornecidas." };
    }

    const resposta = await FetchHelper.get<{ sucesso: boolean, message: string, resposta: any[] }>({
        rota: `/menu/all-by-date?campus_id=${campus_id}&date=${data}`,
        cookies: cookies(),
        rotaParaRedirecionarCasoFalhe: null,
    });

    if (!resposta.sucesso) {
        return { sucesso: false, mensagem: resposta.message };
    }

    const refeicoesFormatadas = resposta.resposta.flatMap(formatarRefeicaoDoBackendParaOFrontend);

    const todasAsRefeicoes: TRefeicaoECardapio[] = refeicoes_disponiveis.map(cardapio => {
        const refeicaoEncontrada = refeicoesFormatadas.find(refeicaoFormatada => refeicaoFormatada.meal.id === cardapio.id);

        return refeicaoEncontrada ? refeicaoEncontrada : {
            meal: cardapio,
            menu: {
                agendado: false,
                description: "Não cadastrado",
                campus_id,
                date: data,
                id: 0,
                permission: 0,
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
export async function buscarRefeicoes(): Promise<IRespostaDeAction<TRefeicao>> {
    const resposta = await FetchHelper.get<TRefeicao[]>({
        rota: "/meal/all",
        cookies: cookies(),
        rotaParaRedirecionarCasoFalhe: null,
    });

    if (!resposta.sucesso) return {
        sucesso: false,
        mensagem: resposta.message
    }

    // Refeições buscadas com sucesso
    const refeicoes: TRefeicao[] = resposta.resposta.map((refeicao: any) => ({
        id: refeicao.id,
        description: refeicao.description,
        qtdTimeReservationEnd: refeicao.qtdTimeReservationEnd,
        qtdTimeReservationStart: refeicao.qtdTimeReservationStart,
        timeEnd: refeicao.timeEnd,
        timeStart: refeicao.timeStart,
        campus_id: refeicao.campus_id
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
 * @deprecated
*/
export async function deprecated_criarRelatorioDeDesperdicio(formData: FormData) {
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

/**
 * Realiza uma chamada assíncrona para a API de agendamentos.
 * 
 * @param formData - Os dados do formulário de agendamento.
 * @returns JSON com os campos { sucesso: false, mensagem: string } ou { sucesso: true, resposta: TRefeicao[] }.
 */
export async function buscarAgendamentos({ data_inicial }: { data_inicial: string }): Promise<IRespostaDeAction<TAgendamento>> {
    const resposta = await FetchHelper.get<IRespostaPaginada<TAgendamento>>({
        rota: `/scheduling/list-by-date?page=1&date=${data_inicial}`,
        cookies: cookies(),
        rotaParaRedirecionarCasoFalhe: null,
    });

    if (!resposta.sucesso) {
        return { sucesso: false, mensagem: resposta.message };
    }

    // Formata a resposta da API
    const agendamentos = resposta.resposta[0].data.flatMap(agendamento => {
        const formatar = TAgendamentoSchema.safeParse(agendamento);

        return formatar.success ? formatar.data : [];
    });


    return {
        sucesso: true,
        resposta: agendamentos
    };
}

/**
 * Realiza uma chamada assíncrona para a API de remoção de agendamento.
 * 
 * @param id - O ID do agendamento a ser removido.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function removerAgendamento({ id }: { id?: number }) {
    if (!id) return { sucesso: false, mensagem: "ID da refeição não informado" };

    const resposta = await FetchHelper.delete<{ message: string }>({
        rota: `/scheduling/${id}`,
        cookies: cookies(),
        rotaParaRedirecionarCasoFalhe: null,
    });

    // Se a resposta for erro e a mensagem for "O Agendamento foi excluído.", retornar sucesso.
    if (!resposta.sucesso && resposta.message == "O Agendamento foi excluído.") {
        return { sucesso: true, mensagem: resposta.message };
    }

    if (!resposta.sucesso) {
        return { sucesso: false, mensagem: resposta.message };
    }

    return { sucesso: true, mensagem: "Agendamento removido com sucesso." };
}

/**
 * Realiza uma chamada assíncrona para a API de confirmação de agendamento.
 * 
 * @param student_id - O ID do estudante. Também conhecido como código do restaurante. 
 * @param meal_id - O ID da refeição.
 * @param date - A data do agendamento.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function confirmarAgendamento({ student_id, meal_id, date }: { student_id: number, meal_id: number, date: string }) {
    const resposta = await FetchHelper.post<unknown>({
        rota: "/confirm-meals",
        cookies: cookies(),
        body: {
            student_id,
            meal_id,
            date
        }
    });

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

    return { sucesso: true, mensagem: "Agendamento confirmado com sucesso." };
}

/**
 * Realiza uma chamada assíncrona para a API de criação de agendamento.
 * 
 * @param formData - Os dados do formulário de agendamento.
 * @returns JSON com os campos { sucesso: false, mensagem: string } ou { sucesso: true, resposta: TAgendamento }.
 */
export async function criarAgendamento(formData: FormData) {
    const resposta = await FetchHelper.post<TAgendamento>({
        rota: "/scheduling",
        cookies: cookies(),
        body: {
            student_id: formData.get('student_id'),
            meal_id: formData.get('meal_id'),
            date: formData.get('date')
        }
    });

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

    return { sucesso: true, resposta: resposta.resposta[0] };
}

/**
 * Realiza uma chamada assíncrona para a API de remoção de refeição.
 * 
 * @param id - O ID da refeição a ser removida.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function removerRefeicao({ id }: { id?: number }) {
    if (!id) return { sucesso: false, mensagem: "ID da refeição não informado" };

    const resposta = await FetchHelper.delete<{ message: string }>({
        rota: `/meal/${id}`,
        cookies: cookies(),
        rotaParaRedirecionarCasoFalhe: null,
    });

    // Se a resposta for erro e a mensagem for "A refeição foi excluída.", retornar sucesso.
    if (!resposta.sucesso && resposta.message == "A refeição foi excluída.") {
        return { sucesso: true, mensagem: resposta.message };
    }

    if (!resposta.sucesso) {
        return { sucesso: false, mensagem: resposta.message };
    }

    return { sucesso: false, mensagem: resposta.resposta[0].message };
}

/**
 * Realiza uma chamada assíncrona para a API de criação de refeição.
 * 
 * @param formData - Os dados do formulário de criação de refeição.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function criarRefeicao(formData: FormData) {
    const resposta = await FetchHelper.post<TRefeicao>({
        rota: "/meal",
        cookies: cookies(),
        body: {
            description: formData.get('description'),
            timeStart: formData.get('timeStart'),
            timeEnd: formData.get('timeEnd'),
            qtdTimeReservationStart: formData.get('qtdTimeReservationStart'),
            qtdTimeReservationEnd: formData.get('qtdTimeReservationEnd'),
            campus_id: formData.get('campus_id')
        }
    })

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

    return { sucesso: true, mensagem: "Refeição criada com sucesso." };
}

/**
 * Realiza uma chamada assíncrona para a API de edição de refeição.
 * 
 * @param formData - Os dados do formulário de edição de refeição.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function editarRefeicao(formData: FormData) {
    const resposta = await FetchHelper.put<unknown>({
        rota: `/meal/${formData.get('meal_id')}`,
        cookies: cookies(),
        body: {
            description: formData.get('description'),
            timeStart: formData.get('timeStart'),
            timeEnd: formData.get('timeEnd'),
            qtdTimeReservationStart: formData.get('qtdTimeReservationStart'),
            qtdTimeReservationEnd: formData.get('qtdTimeReservationEnd'),
            campus_id: formData.get('campus_id')
        }
    });

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

    return { sucesso: true, mensagem: "Refeição editada com sucesso." };
}

/**
 * Realiza uma chamada assíncrona para a API de relatório de refeições.
 * 
 * @param data_inicial - A data inicial do relatório.
 * @param data_final - A data final do relatório.
 * @returns JSON com os campos { sucesso: false, mensagem: string } ou { sucesso: true, resposta: TRelatorioDeRefeicoes[] }.
 */
export async function buscarRelatorioDeRefeicoes({ data_inicial, data_final }: { data_inicial?: string, data_final?: string }): Promise<{ sucesso: false, mensagem: string } | { sucesso: true, resposta: TRelatorioDeRefeicoes[] }> {
    if (!data_inicial || !data_final) {
        return { sucesso: false, mensagem: "Data inicial e data final são obrigatórias." };
    }

    const resposta = await FetchHelper.get<IRespostaPaginada<TRelatorioDeRefeicoes>>({
        rota: `/report/list-scheduling?start_date=${data_inicial}&end_date=${data_final}`,
        cookies: cookies(),
        rotaParaRedirecionarCasoFalhe: null,
    });

    if (!resposta.sucesso) {
        return { sucesso: false, mensagem: resposta.message };
    }

    return {
        sucesso: true,
        resposta: resposta.resposta[0].data
    };
}

/**
 * Realiza uma chamada assíncrona para a API de relatório de desperdício.
 * 
 * @param data_inicial - A data inicial do relatório.
 * @param data_final - A data final do relatório.
 * @returns JSON com os campos { sucesso: false, mensagem: string } ou { sucesso: true, resposta: [] }.
 */
export async function buscarRelatorioDeDesperdicio({ data_inicial, data_final }: { data_inicial?: string, data_final?: string }) {
    if (!data_inicial || !data_final) {
        return { sucesso: false, mensagem: "Data inicial e data final são obrigatórias." };
    }

    const resposta = await FetchHelper.get<IRelatorioDeDesperdicio>({
        rota: `/food-waste?start_date=${data_inicial}&end_date=${data_final}`,
        cookies: cookies(),
        rotaParaRedirecionarCasoFalhe: null,
    });

    if (!resposta.sucesso) {
        return { sucesso: false, mensagem: resposta.message };
    }

    return {
        sucesso: true,
        resposta: resposta.resposta
    };
}

/**
 * Cria um novo relatório de desperdício.
 * 
 * @param formData - Os dados do formulário de criação de relatório de desperdício.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export async function criarRelatorioDeDesperdicio(formData: FormData) {
    const resposta = await FetchHelper.post<unknown>({
        rota: "/food-waste",
        cookies: cookies(),
        body: {
            total_food_waste: formData.get('total_food_waste'),
            menu_id: formData.get('menu_id'),
            waste_date: formData.get('waste_date')
        }
    });

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

    return { sucesso: true, mensagem: "Relatório de desperdício criado com sucesso." };
}
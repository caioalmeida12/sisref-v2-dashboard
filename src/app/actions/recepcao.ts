"use server";

/**
 * Este módulo contém todas as actions relacionadas à página de recepção.
 */

import { cookies } from "next/headers";
import {
  TCardapio,
  TRefeicao,
  TRefeicaoECardapio,
  TRefeicaoECardapioSchema,
} from "../interfaces/TRefeicao";
import { FetchHelper } from "../lib/actions/FetchHelper";

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
      permission: 1,
    } satisfies TCardapio,
  });

  return formatar.success ? formatar.data : [];
};

/**
 *  Busca as refeições de um determinado campus para uma determinada data.
 *  Esta função é diferente da buscarTabelaDeCardapios presente na action de nutricionista, pois aquela busca de um endpoint que a classe recepcionista não tem acesso.
 */
export async function buscarTabelaDeCardapios({
  campus_id,
  data,
  refeicoes_disponiveis,
}: {
  campus_id: number;
  data: string;
  refeicoes_disponiveis?: TRefeicao[];
}): Promise<
  | { sucesso: false; mensagem: string }
  | { sucesso: true; resposta: TRefeicaoECardapio[] }
> {
  if (!refeicoes_disponiveis?.length) {
    return {
      sucesso: false,
      mensagem: "Refeições disponíveis não foram fornecidas.",
    };
  }

  const resposta = await FetchHelper.get<{
    sucesso: boolean;
    message: string;
    resposta: any[];
  }>({
    rota: `/all/menus-by-date?date=${data}`,
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  const refeicoesFormatadas = resposta.resposta.flatMap(
    formatarRefeicaoDoBackendParaOFrontend,
  );

  const todasAsRefeicoes: TRefeicaoECardapio[] = refeicoes_disponiveis.map(
    (cardapio) => {
      const refeicaoEncontrada = refeicoesFormatadas.find(
        (refeicaoFormatada) => refeicaoFormatada.meal.id === cardapio.id,
      );

      return refeicaoEncontrada
        ? refeicaoEncontrada
        : {
            meal: cardapio,
            menu: {
              agendado: false,
              description: "Não cadastrado",
              campus_id,
              date: data,
              id: 0,
              permission: 0,
            },
          };
    },
  );

  return {
    sucesso: true,
    resposta: todasAsRefeicoes,
  };
}

"use server";

import { cookies } from "next/headers";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { TJustificativaNaoProcessada } from "../interfaces/TJustificativaNaoProcessada";
import { IRespostaDeAction } from "../interfaces/IRespostaDeAction";

/**
 * Este módulo contém todas as actions relacionadas à página de assistência estudantil.
 */

/**
 * Busca as justificativas não processadas.
 */
export async function buscarJustificativasNaoProcessadas(): Promise<
  IRespostaDeAction<TJustificativaNaoProcessada>
> {
  const resposta = await FetchHelper.get({
    rota: "/scheduling/unprocessed-justifications",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  const formatadas: TJustificativaNaoProcessada[] = resposta.resposta.flatMap(
    (justificativa: any) => {
      const formatar = TJustificativaNaoProcessada.safeParse(justificativa);

      return formatar.success ? [formatar.data] : [];
    },
  );

  return { sucesso: true, resposta: formatadas };
}

/**
 * Marca uma justificativa como processada.
 * @param id O ID da justificativa.
 */
export async function marcarJustificativaComoProcessada(id: number) {
  const resposta = await FetchHelper.put({
    rota: `/scheduling/processed-justifications/${id}`,
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: {},
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  return { sucesso: true };
}
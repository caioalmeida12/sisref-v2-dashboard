"use server";

import { cookies } from "next/headers";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { TJustificativaNaoProcessada } from "../interfaces/TJustificativaNaoProcessada";

/**
 * Este módulo contém todas as actions relacionadas à página de assistência estudantil.
 */

/**
 * Busca as justificativas não processadas.
 */
export async function buscarJustificativasNaoProcessadas() {
  const resposta = await FetchHelper.get({
    rota: "/scheduling/unprocessed-justifications",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  const formatadas = resposta.resposta.flatMap((justificativa) => {
    const formatar = TJustificativaNaoProcessada.safeParse(justificativa);

    return formatar.success ? formatar.data : [];
  });

  return { sucesso: true, resposta: formatadas };
}

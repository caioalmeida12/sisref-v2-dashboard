"use server";

import { cookies } from "next/headers";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { TJustificativaNaoProcessada } from "../interfaces/TJustificativaNaoProcessada";
import { IRespostaDeAction } from "../interfaces/IRespostaDeAction";
import { IRespostaPaginada } from "../interfaces/IRespostaPaginada";
import {
  TEstudanteComCurso,
  TEstudanteComCursoSchema,
  TEstudanteComCursoTurnoEUsuario,
  TEstudanteComCursoTurnoEUsuarioSchema,
} from "../interfaces/TEstudante";

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

  return { sucesso: true, resposta: resposta.resposta };
}

/**
 * Justifica uma ausência sem a necessidade de solicitação por parte de estudante.
 * @param id O ID da justificativa.
 * @param absenceJustification O motivo da justificativa.
 */
export async function justificarAusencia(
  id: number,
  absenceJustification: string,
): Promise<IRespostaDeAction<any>> {
  console.log(absenceJustification);

  const resposta = await FetchHelper.post({
    rota: `/scheduling/justification/${id}`,
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: {
      absenceJustification,
    },
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  return { sucesso: true, resposta: resposta.resposta };
}

/**
 * Busca todos os registros de estudante.
 */
export const buscarEstudantes = async (): Promise<
  IRespostaDeAction<TEstudanteComCursoTurnoEUsuario>
> => {
  const resposta = await FetchHelper.get<
    IRespostaPaginada<TEstudanteComCursoTurnoEUsuario>
  >({
    rota: "/student/",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  const estudantes = resposta.resposta[0].data.flatMap((estudante) => {
    const formatar = TEstudanteComCursoTurnoEUsuarioSchema.safeParse(estudante);

    formatar.success === false && console.error(formatar.error.errors);

    return formatar.success ? [formatar.data] : [];
  });

  return { sucesso: true, resposta: estudantes };
};

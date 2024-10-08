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
import { TCurso, TCursoSchema } from "../interfaces/TCurso";
import { TTurno, TTurnoSchema } from "../interfaces/TTurno";
import { TCampus, TCampusSchema } from "../interfaces/TCampus";

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

    return formatar.success ? [formatar.data] : [];
  });

  return { sucesso: true, resposta: estudantes };
};

/**
 * Cria um novo estudante.
 */
export const criarEstudante = async (formData: FormData): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.post({
    rota: "/student/",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: formData,
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
}

/**
 * Busca todos os cursos disponíveis.
 */
export const buscarCursos = async (): Promise<IRespostaDeAction<TCurso>> => {
  const resposta = await FetchHelper.get<IRespostaPaginada<TCurso>>({
    rota: "/course/",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  const cursos = resposta.resposta[0].data.flatMap((curso) => {
    const formatar = TCursoSchema.safeParse(curso);

    formatar.error?.errors && console.log(curso);
    formatar.error?.errors && console.log(formatar.error.errors);

    return formatar.success ? [formatar.data] : [];
  });

  return { sucesso: true, resposta: cursos };
}

/**
 * Busca todos os turnos disponíveis.
 */
export const buscarTurnos = async (): Promise<IRespostaDeAction<TTurno>> => {
  const resposta = await FetchHelper.get<IRespostaPaginada<TTurno>>({
    rota: "/shift/",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  const turnos = resposta.resposta[0].data.flatMap((turno) => {
    const formatar = TTurnoSchema.safeParse(turno);

    return formatar.success ? [formatar.data] : [];
  });

  return { sucesso: true, resposta: turnos };
}
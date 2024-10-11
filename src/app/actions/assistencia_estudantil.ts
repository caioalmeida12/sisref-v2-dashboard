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
import { TRepublica, TRepublicaSchema } from "../interfaces/TRepublica";

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
    rota: `/student/`,
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
export const criarEstudante = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.post({
    rota: "/student/",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
};

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

    return formatar.success ? [formatar.data] : [];
  });

  return { sucesso: true, resposta: cursos };
};

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
};

/**
 * Edita um estudante.
 * @param formData Os dados do estudante.
 */
export const editarEstudante = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.put({
    rota: `/student/${formData.get("id")}`,
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
};

/**
 * Realiza uma chamada assíncrona para a API de remoção de estudante.
 *
 * @param formData - Os dados de estudante.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export const removerEstudante = async ({
  student_id,
}: {
  student_id?: number;
}) => {
  if (!student_id)
    return { sucesso: false, mensagem: "ID de estudante não informado" };

  const resposta = await FetchHelper.delete<{ message: string }>({
    rota: `/student/${student_id}`,
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  // Se a resposta for erro e a mensagem for "O Estudante foi excluído.", retornar sucesso.
  if (!resposta.sucesso && resposta.message == "O Estudante foi excluído.") {
    return { sucesso: true, mensagem: resposta.message };
  }

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  // Retornar mensagem de erro genérica se a mensagem não for "O Estudante foi excluído."
  return { sucesso: false, mensagem: resposta.resposta[0].message };
};

/**
 * Atualiza matrículas em massa
 * @param formData - O começo das matriculas e a nova data de vencimento
 */
export const atualizarVencimentosEmMassa = async (
  formData: FormData,
): Promise<IRespostaDeAction<string>> => {
  const resposta = await FetchHelper.put<{ message: string }>({
    rota: `/student/massUpdate/`,
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  return { sucesso: true, resposta: ["Atualização feita com sucesso."] };
};

/**
 * Busca todas as repúblicas
 */
export const buscarRepublicas = async (): Promise<
  IRespostaDeAction<TRepublica>
> => {
  const resposta = await FetchHelper.get<IRespostaPaginada<TRepublica>>({
    rota: "/republic",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  const formatadas = resposta.resposta[0].data.flatMap((republica) => {
    const formatar = TRepublicaSchema.safeParse(republica);

    return formatar.success ? [formatar.data] : [];
  });

  return { sucesso: true, resposta: formatadas };
};

/*
 * Cria uma nova república.
 */
export const criarRepublica = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.post({
    rota: "/republic/",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
};

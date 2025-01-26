"use server";

import { cookies } from "next/headers";
import { IResquisicaoPaginada } from "../interfaces/IRequisicaoPaginada";
import { IRespostaDeAction } from "../interfaces/IRespostaDeAction";
import { IRespostaPaginada } from "../interfaces/IRespostaPaginada";
import { TBuscarRefeicoesAutorizadas, TBuscarRefeicoesAutorizadasSchema } from "../interfaces/TBuscarRefeicoesAutorizadas";
import { TCurso, TCursoSchema } from "../interfaces/TCurso";
import {
  TEstudante,
  TEstudanteComCursoTurnoEUsuario,
  TEstudanteComCursoTurnoEUsuarioSchema,
  TEstudanteSchema,
} from "../interfaces/TEstudante";
import { TJustificativaNaoProcessada } from "../interfaces/TJustificativaNaoProcessada";
import { TRepublica, TRepublicaSchema } from "../interfaces/TRepublica";
import { TTurno, TTurnoSchema } from "../interfaces/TTurno";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { respostaPaginadaPadrao } from "../lib/actions/RespostaPaginadaPadrao";
import { StudentMealData } from "../lib/elementos/HandleSudentMealData";

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
    cookies: await cookies(),
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
    cookies: await cookies(),
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
    cookies: await cookies(),
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
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  const estudantes = resposta.resposta[0].data.flatMap((estudante) => {
    const formatar = TEstudanteComCursoTurnoEUsuarioSchema.safeParse(estudante);

    return formatar.success ? [formatar.data] : [];
  });

  return { sucesso: true, resposta: estudantes };
};

export const buscarEstudantesPorCodigo = async (matricula: string): Promise<
  IRespostaDeAction<TEstudante>
> => {
  const resposta = await FetchHelper.get<
    IRespostaPaginada<TEstudanteComCursoTurnoEUsuario>
  >({
    rota: `/all/students-by-mat-or-cod?mat=${matricula}`,
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  const estudantes = resposta.resposta.flatMap((estudante) => {
    const formatar = TEstudanteSchema.safeParse(estudante);

    return formatar.success ? [formatar.data] : [];
  });

  return { sucesso: true, resposta: estudantes };
};

/**
 * Busca registros de estudante com base em matrícula 
 */


/**
 * Busca todos os registros de estudante.
 */
export const buscarEstudantesComPaginacao = async (
  paginacao: IResquisicaoPaginada,
): Promise<IRespostaPaginada<TEstudanteComCursoTurnoEUsuario>> => {
  const resposta = await FetchHelper.get<
    IRespostaPaginada<TEstudanteComCursoTurnoEUsuario>
  >({
    rota: `/student?page=${paginacao.page}&perPage=${paginacao.per_page}`,
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return respostaPaginadaPadrao

  return resposta.resposta[0];
};

/**
 * Cria um novo estudante.
 */
export const criarEstudante = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.post({
    rota: "/student/",
    cookies: await cookies(),
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
    cookies: await cookies(),
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
    cookies: await cookies(),
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
    cookies: await cookies(),
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
    cookies: await cookies(),
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
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (
    !resposta.sucesso &&
    resposta.message == "Atualização realizada com sucesso."
  )
    return { sucesso: true, resposta: ["Atualização feita com sucesso."] };

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
    cookies: await cookies(),
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
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
};

/**
 * Realiza uma chamada assíncrona para a API de remoção de república.
 *
 * @param formData - Os dados de república.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export const removerRepublica = async (
  formData: FormData,
): Promise<IRespostaDeAction<string>> => {
  if (!formData.get("id"))
    return { sucesso: false, mensagem: "ID de república não informado" };

  const resposta = await FetchHelper.delete<{ message: string }>({
    rota: `/republic/${formData.get("id")}`,
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  // Se a resposta for erro e a mensagem for "A república foi excluída.", retornar sucesso.
  if (!resposta.sucesso && resposta.message == "A república foi excluída.") {
    return { sucesso: true, resposta: [resposta.message] };
  }

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  // Retornar mensagem de erro genérica se a mensagem não for "A república foi excluída."
  return { sucesso: false, mensagem: resposta.resposta[0].message };
};

/**
 * Edita uma república.
 * @param formData Os dados da república.
 */
export const editarRepublica = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.put({
    rota: `/republic/${formData.get("id")}`,
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
};

/**
 * Realiza uma chamada assíncrona para a API de remoção de curso.
 *
 * @param formData - Os dados de curso.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export const removerCurso = async (
  formData: FormData,
): Promise<IRespostaDeAction<string>> => {
  if (!formData.get("id"))
    return { sucesso: false, mensagem: "ID de curso não informado" };

  const resposta = await FetchHelper.delete<{ message: string }>({
    rota: `/course/${formData.get("id")}`,
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  // Se a resposta for erro e a mensagem for "O Curso foi deletado.", retornar sucesso.
  if (!resposta.sucesso && resposta.message == "O Curso foi deletado.") {
    return { sucesso: true, resposta: [resposta.message] };
  }

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  // Retornar mensagem de erro genérica se a mensagem não for "O Curso foi deletado."
  return { sucesso: false, mensagem: resposta.resposta[0].message };
};

/**
 * Edita um curso.
 * @param formData Os dados do curso.
 */
export const editarCurso = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.put({
    rota: `/course/${formData.get("id")}`,
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
};

/*
 * Cria um novo curso.
 */
export const criarCurso = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.post({
    rota: "/course/",
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
};

/**
 * Realiza uma chamada assíncrona para a API de remoção de turno.
 *
 * @param formData - Os dados de turno.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export const removerTurno = async (
  formData: FormData,
): Promise<IRespostaDeAction<string>> => {
  if (!formData.get("id"))
    return { sucesso: false, mensagem: "ID de turno não informado" };

  const resposta = await FetchHelper.delete<{ message: string }>({
    rota: `/shift/${formData.get("id")}`,
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  // Se a resposta for erro e a mensagem for "O Turno foi excluído.", retornar sucesso.
  if (!resposta.sucesso && resposta.message == "O Turno foi excluído.") {
    return { sucesso: true, resposta: [resposta.message] };
  }

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  // Retornar mensagem de erro genérica se a mensagem não for "O Turno foi excluído.
  return { sucesso: false, mensagem: resposta.resposta[0].message };
};

/*
 * Cria um novo curso.
 */
export const criarTurno = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.post({
    rota: "/shift/",
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
};

/**
 * Edita um turno.
 * @param formData Os dados do turno.
 */
export const editarTurno = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.put({
    rota: `/shift/${formData.get("id")}`,
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
};

/**
 * Busca as refeições autorizadas para o estudante com perfil de assistência estudantil.
 *
 * @returns Um array de objetos contendo as refeições autorizadas.
 */
export async function buscarRefeicoesAutorizadasPorEstudante(student_id: number): Promise<IRespostaDeAction<TBuscarRefeicoesAutorizadas>> {
  const resposta = await FetchHelper.get<unknown>({
    rota: `/allowstudenmealday?student_id=${student_id}`,
    cookies: await cookies(),
  });


  if (!resposta.sucesso) return {
    sucesso: false,
    mensagem: resposta.message
  }

  const formatadas = resposta.resposta.flatMap(
    (refeicao: any) => {
      const formatar = TBuscarRefeicoesAutorizadasSchema.safeParse(refeicao);

      return formatar.success ? [formatar.data] : [];
    },
  );

  return { sucesso: true, resposta: formatadas };
}

export async function atualizarRefeicoesAutorizadas(studentMealsData: StudentMealData[]): Promise<IRespostaDeAction<TBuscarRefeicoesAutorizadas>[]> {
  const respostas = await Promise.allSettled(studentMealsData.map(async (studentMealData) => {
    try {
      const resposta = await FetchHelper.put<unknown>({
        rota: `/allowstudenmealday/${studentMealData.meal_id}`,
        body: studentMealData,
        cookies: await cookies(),
      });

      if (!resposta.sucesso) {
        console.error('Erro na resposta do FetchHelper:', resposta.message);
        return {
          sucesso: false as const,
          mensagem: resposta.message
        };
      }

      const formatar = TBuscarRefeicoesAutorizadasSchema.safeParse(resposta.resposta);

      if (!formatar.success) {
        console.error('Erro ao formatar a resposta:', formatar.error);
      }

      return formatar.success ? { sucesso: true as const, resposta: [formatar.data] } : { sucesso: false as const, mensagem: 'Erro ao formatar a resposta' };
    } catch (error: any) {
      console.error('Erro ao processar a refeição do estudante:', error);
      return {
        sucesso: false as const,
        mensagem: error.message || 'Erro desconhecido'
      };
    }
  }));

  return respostas.map((res) => {
    if (res.status === 'fulfilled') {
      return res.value;
    } else {
      console.error('Erro na promessa:', res.reason);
      return {
        sucesso: false as const,
        mensagem: res.reason.message || 'Erro desconhecido'
      };
    }
  });
}
"use server";

import { cookies } from "next/headers";
import { IRespostaDeAction } from "../interfaces/IRespostaDeAction";
import { IRespostaPaginada } from "../interfaces/IRespostaPaginada";
import { TUsuario, TUsuarioSchema } from "../interfaces/TUsuario";
import { FetchHelper } from "../lib/actions/FetchHelper";

/**
 * Busca todos os usuarios disponíveis.
 */
export const buscarUsuarios = async (): Promise<
  IRespostaDeAction<TUsuario>
> => {
  const resposta = await FetchHelper.get<IRespostaPaginada<TUsuario>>({
    rota: "/user/",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

  const usuarios = resposta.resposta[0].data.flatMap((usuario) => {
    const formatar = TUsuarioSchema.safeParse(usuario);

    return formatar.success ? [formatar.data] : [];
  });

  return { sucesso: true, resposta: usuarios };
};

/**
 * Remove um usuário.
 *
 * @param formData - Os dados de usuário.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export const removerUsuario = async (
  formData: FormData,
): Promise<IRespostaDeAction<string>> => {
  if (!formData.get("id"))
    return { sucesso: false, mensagem: "ID de usuário não informado" };

  const resposta = await FetchHelper.delete<{ message: string }>({
    rota: `/user/${formData.get("id")}`,
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  // Se a resposta for erro e a mensagem for 'A Usuário foi deletado.', retornar sucesso.
  if (!resposta.sucesso && resposta.message == "A Usuário foi deletado.") {
    return { sucesso: true, resposta: ["O usuário foi deletado."] };
  }

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: false, mensagem: resposta.resposta[0].message };
};

/**
 * Edita um usuário.
 * @param formData Os dados do usuário.
 */
export const editarUsuario = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.put({
    rota: `/user/${formData.get("id")}`,
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
 * Cria um novo campus.
 */
export const criarCampus = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.post({
    rota: "/campus/",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  console.log(resposta);

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
};

/**
 * Edita um campus.
 * @param formData Os dados do campus.
 */
export const editarCampus = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.put({
    rota: `/campus/${formData.get("id")}`,
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
 * Realiza uma chamada assíncrona para a API de remoção de campus.
 *
 * @param formData - Os dados de campus.
 * @returns JSON com os campos `sucesso` e `mensagem`.
 */
export const removerCampus = async (
  formData: FormData,
): Promise<IRespostaDeAction<string>> => {
  if (!formData.get("id"))
    return { sucesso: false, mensagem: "ID de campus não informado" };

  const resposta = await FetchHelper.delete<{ message: string }>({
    rota: `/campus/${formData.get("id")}`,
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  // Se a resposta for erro e a mensagem for "O Campus foi deletado.", retornar sucesso.
  if (!resposta.sucesso && resposta.message == "O Campus foi deletado.") {
    return { sucesso: true, resposta: [resposta.message] };
  }

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  // Retornar mensagem de erro genérica se a mensagem não for "O Campus foi deletado."
  return { sucesso: false, mensagem: resposta.resposta[0].message };
};

/**
 * Registra um novo usuário
 */
export const registrarUsuario = async (
  formData: FormData,
): Promise<IRespostaDeAction<unknown>> => {
  const resposta = await FetchHelper.post({
    rota: "/register/",
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null,
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return { sucesso: true, resposta: resposta.resposta };
};

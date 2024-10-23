"use server";

import { cookies } from "next/headers";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";
import { redirect } from "next/navigation";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { IInformacoesDeLogin } from "../lib/middlewares/IInformacoesDeLogin";
import { IRespostaDeAction } from "../interfaces/IRespostaDeAction";

/**
 * Realiza uma chamada assíncrona para a API de login.
 *
 * @param formData - Os dados do formulário de login.
 * @redirects success - Para a página inicial do sistema.
 * @redirects fail - Para a página de login com uma mensagem de erro caso haja algum problema.
 */
export async function login(formData: FormData) {
  const resposta = await FetchHelper.post<IInformacoesDeLogin>({
    rota: "/login",
    cookies: await cookies(),
    body: Object.fromEntries(formData),
  });

  if (!resposta.sucesso) {
    return redirect(`/login?erro=${encodeURIComponent(resposta.message)}`);
  }

  // Autenticado com sucesso
  const informacoesLogin: IInformacoesDeLogin = {
    // é necessário fazer um cast para o campo classification, pois a resposta da API traz o campo como 'classfication' -- falta um 'i'
    classification: (resposta.resposta[0] as any).classfication,
    ...(resposta.resposta[0] as any),
  };

  (await cookies()).set(
    "authorization",
    `Bearer ${informacoesLogin.access_token}`,
  );
  (await cookies()).set("classification", informacoesLogin.classification);

  const redirecionar = {
    ADMIN: "/administrador",
    NUTRI: "/nutricionista",
    RECEPCAO: "/recepcao",
    ASSIS_ESTU: "/assistencia_estudantil",
    STUDENT: "/",
  } as const;

  if (!redirecionar[informacoesLogin.classification])
    return redirect(
      `/login?erro=${encodeURIComponent("Classificação de usuário inválida. Faça login novamente.")}`,
    );

  return redirecionarViaAction(redirecionar[informacoesLogin.classification]);
}

export async function buscarHorarioNoServidor(): Promise<
  IRespostaDeAction<string>
> {
  const resposta = await FetchHelper.get<string>({
    rota: "/horario",
    cookies: await cookies(),
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: "não encontrado" };

  return { sucesso: true, resposta: resposta.resposta };
}

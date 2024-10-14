"use server"

import { cookies } from "next/headers";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { TCampus, TCampusSchema } from "../interfaces/TCampus";
import { IRespostaDeAction } from "../interfaces/IRespostaDeAction";
import { IRespostaPaginada } from "../interfaces/IRespostaPaginada";

export const buscarCampus = async (id: string) => {
  const resposta = await FetchHelper.get<TCampus>({
    rota: `/all/campus/`,
    cookies: cookies(),
  });

  if (!resposta.sucesso)
    return redirecionarViaAction(
      `/login?erro=${encodeURIComponent(resposta.message)}`,
    );

  return (
    resposta.resposta.find((campus) => campus.id === Number(id)) || {
      id: 0,
      description: "Campus não encontrado",
    }
  );
};

export const buscarCampi = async (): Promise<IRespostaDeAction<TCampus>> => {
  const resposta = await FetchHelper.get<IRespostaPaginada<TCampus>>({
    rota: `/campus/`,
    cookies: cookies(),
    rotaParaRedirecionarCasoFalhe: null
  });

  if (!resposta.sucesso) return { sucesso: false, mensagem: "Não foi possível buscar pelos campi" }

  const campi = resposta.resposta[0].data.flatMap((campus) => {
    const formatar = TCampusSchema.safeParse(campus);

    return formatar.success ? [formatar.data] : [];
  });

  return { sucesso: true, resposta: campi }
}; 
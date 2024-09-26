import { cookies } from "next/headers";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";
import { FetchHelper } from "../lib/actions/FetchHelper";
import { TCampus } from "../interfaces/TCampus";

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

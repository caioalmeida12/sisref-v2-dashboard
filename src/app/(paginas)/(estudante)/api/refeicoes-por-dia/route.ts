import { NextRequest, NextResponse } from "next/server";
import {
  TRefeicaoECardapio,
  TRefeicaoECardapioSchema,
} from "@/app/interfaces/TRefeicao";
import { FetchHelper } from "@/app/lib/actions/FetchHelper";
import { redirecionarViaAction } from "@/app/lib/actions/RedirecionarViaAction";
import { cookies } from "next/headers";

/**
 * Busca as refeições disponíveis para o dia solicitado. Se não for passado nenhum parâmetro, a data atual será utilizada.
 *
 * @param data Data no formato "YYYY-MM-DD"
 * @returns Um array de objetos contendo as refeições disponíveis para o dia solicitado.
 */
async function buscarRefeicoesPorDia(data: string) {
  const resposta = await FetchHelper.get<TRefeicaoECardapio>({
    rota: `/all/menus-today?date=${data}`,
    cookies: await cookies(),
  });

  if (!resposta.sucesso) {
    return redirecionarViaAction(
      `/login?erro=${encodeURIComponent(resposta.message)}`,
    );
  }

  const refeicoes = resposta.resposta.flatMap((refeicao: any) => {
    const { meal, ...menu } = refeicao;

    const formatar = TRefeicaoECardapioSchema.safeParse({
      meal,
      menu: {
        ...menu,
        agendado: menu.agendado,
        permission: menu.permission,
      },
    });

    return formatar.success ? formatar.data : [];
  });

  return refeicoes;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const data =
    searchParams.get("data") || new Date().toISOString().split("T")[0];
  const refeicoes = await buscarRefeicoesPorDia(data);
  return NextResponse.json({ sucesso: true, resposta: refeicoes });
}

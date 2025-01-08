import { IRespostaDeAction } from "@/app/interfaces/IRespostaDeAction";
import { IRespostaPaginada } from "@/app/interfaces/IRespostaPaginada";
import { FetchHelper } from "@/app/lib/actions/FetchHelper";
import { respostaPaginadaPadrao } from "@/app/lib/actions/RespostaPaginadaPadrao";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function fetchComPaginacao<T>(
  rota: string,
  paginacao: Pick<IRespostaPaginada<T>, "current_page" | "per_page">,
  cookies: ReadonlyRequestCookies
): Promise<IRespostaPaginada<T>> {
  const resposta = await FetchHelper.get<IRespostaPaginada<T>>({
    rota: `${rota}?page=${paginacao.current_page}&perPage=${paginacao.per_page}`,
    cookies: cookies,
    rotaParaRedirecionarCasoFalhe: null,
  });

  if (!resposta.sucesso) return respostaPaginadaPadrao as IRespostaPaginada<T>;

  return resposta.resposta[0];
}

export async function GET(req: NextRequest): Promise<NextResponse<IRespostaDeAction<IRespostaPaginada<unknown>>>> {
  const paginacao: Pick<IRespostaPaginada<unknown>, "current_page" | "per_page"> = {
    current_page: parseInt(req.nextUrl.searchParams.get("page") || "1"),
    per_page: parseInt(req.nextUrl.searchParams.get("perPage") || "10"),
  };

  const rota = req.nextUrl.searchParams.get("path");

  if (!rota) {
    return NextResponse.json({
      sucesso: false,
      mensagem: 'Nenhuma rota foi recebida. Certifique-se de enviar o parâmetro path.'
    });
  }

  const resposta = await fetchComPaginacao<unknown>(encodeURI(rota), paginacao, await cookies());

  return NextResponse.json({
    sucesso: true,
    resposta: [resposta]
  });
}
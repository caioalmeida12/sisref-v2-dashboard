import { buscarTicketsSemJustificativa } from "@/app/actions/estudante";
import { IRespostaPaginada } from "@/app/interfaces/IRespostaPaginada";
import {
  TRefeicaoDoHistorico,
  TRefeicaoDoHistoricoSchema,
} from "@/app/interfaces/TRefeicaoDoHistorico";
import { FetchHelper } from "@/app/lib/actions/FetchHelper";
import { redirecionarViaAction } from "@/app/lib/actions/RedirecionarViaAction";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const urlPorTipoDeTicket = {
  "a-ser-utilizado": "/to-use",
  utilizado: "/used",
  cancelado: "/canceled",
  "nao-utilizado": "/not-used",
} as const;

const QUANTOS_TICKETS_MOSTRAR = 10;

type TicketType = keyof typeof urlPorTipoDeTicket;

/**
 * Busca os tickets de refeição do estudante.
 *
 * @param tipo Tipo de ticket a ser buscado. Pode ser `a-ser-utilizado`, `utilizado`, `cancelado` ou `nao-utilizado`.
 * @returns Um array de objetos contendo os tickets de refeição.
 */
const buscarTickets = async (
  tipo: TicketType,
): Promise<TRefeicaoDoHistorico[]> => {
  const API_URL = `/student/schedulings${urlPorTipoDeTicket[tipo]}?page=1`;

  const resposta = await FetchHelper.get<IRespostaPaginada<unknown>>({
    rota: API_URL,
    cookies: cookies(),
  });

  if (!resposta.sucesso) {
    return redirecionarViaAction(
      `/login?erro=${encodeURIComponent(resposta.message)}`,
    );
  }

  return resposta.resposta[0].data
    .map((refeicao) => TRefeicaoDoHistoricoSchema.safeParse(refeicao))
    .flatMap((refeicao) => (refeicao.success ? refeicao.data : []));
};

const fetchAllTickets = async (): Promise<TRefeicaoDoHistorico[]> => {
  const [
    aSerUtilizado,
    utilizado,
    cancelado,
    naoUtilizado,
    naoUtilizadoSemJustificativa,
  ] = await Promise.all([
    buscarTickets("a-ser-utilizado"),
    buscarTickets("utilizado"),
    buscarTickets("cancelado"),
    buscarTickets("nao-utilizado"),
    buscarTicketsSemJustificativa(),
  ]);

  // Adiciona o status de cada ticket
  aSerUtilizado.forEach((ticket) => (ticket.status = "a-ser-utilizado"));
  utilizado.forEach((ticket) => (ticket.status = "utilizado"));
  cancelado.forEach((ticket) => (ticket.status = "cancelado"));
  naoUtilizado.forEach((ticket) => {
    ticket.absenceJustification
      ? (ticket.status = "justificado")
      : (ticket.status = "nao-utilizado");
  });
  naoUtilizadoSemJustificativa.forEach(
    (ticket) => (ticket.status = "nao-utilizado-sem-justificativa"),
  );

  // Concatena todos os tickets e ordena por data
  const todosTickets = [
    ...aSerUtilizado,
    ...utilizado,
    ...cancelado,
    ...naoUtilizado.filter((ticket) => {
      // Remove os tickets que possuem um id que já está presente nos tickets utilizados sem justificativa
      return !naoUtilizadoSemJustificativa.some(
        (ticketSemJustificativa) => ticket.id === ticketSemJustificativa.id,
      );
    }),
  ];
  const todosTicketsOrdenados = todosTickets.sort((a, b) => {
    return new Date(b.menu.date).getTime() - new Date(a.menu.date).getTime();
  });

  console.log(naoUtilizadoSemJustificativa);
  // Seleciona os tickets mais recentes
  const ticketsMaisRecentes = todosTicketsOrdenados.slice(
    0,
    QUANTOS_TICKETS_MOSTRAR,
  );

  // Concatena os tickets sem justificativa no início da lista
  const concatenarTicketsETicketsSemJustificativa = [
    ...naoUtilizadoSemJustificativa,
    ...ticketsMaisRecentes,
  ];

  return concatenarTicketsETicketsSemJustificativa;
};

export async function GET() {
  const tickets = await fetchAllTickets();

  return NextResponse.json({ sucesso: true, resposta: tickets });
}

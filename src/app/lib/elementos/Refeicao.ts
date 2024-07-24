/**
 * IRefeicao é uma interface que representa uma refeição.
 * @param turno - O turno da refeição. (1, 2, 3 ou 4)
 * @param refeicao - A refeição. (opcional)
 * @param cardapio - O cardápio. (opcional
 * 
 * Refeicao:
 * - id: O id da refeição.
 * - description: A descrição da refeição.
 * - qtdTimeReservationEnd: A hora máxima, anterior ao início da refeição, que a refeição estará disponível. Ex: 1 (inicio da refeicao: 20h; pode reservar até 19h (20-1)).
 * - qtdTimeReservationStart: A hora mínima, anterior ao início da refeição, que a refeição estará disponível. Ex: 1 (inicio da refeicao: 20h; pode reservar a partir das 19h (20-1)).
 * - timeEnd: A hora de término da refeição. Ex: "09:00".
 * - timeStart: A hora de início da refeição. Ex: "07:00".
 * 
 * Cardapio:
 * - agendado: Se o cardápio está agendado.
 * - date: A data do cardápio.
 * - description: A descrição do cardápio.
 * - permission: Se o cardápio está disponível para reserva.
 * - id: O id do cardápio.
 * - campus_id: O id do campus.
 * - canceled_by_student: Se o cardápio foi cancelado pelo estudante.
 */

import { IRefeicaoComTurno } from "@/app/elementos/interfaces/IRefeicao";
import { DatasHelper } from "./DatasHelper";

type StatusDaRefeicao = "disponivel" | "encerrado" | "bloqueado" | "cancelado" | "reservado" | "indisponivel";
// Disponivel: a refeição estará disponível para reserva quando a data e hora atual estiverem dentro do intervalo de reserva ((timeStart - qtdTimeReservationStart) e (timeEnd - qtdTimeReservationEnd)).
// Encerrado: a refeição não está mais disponível para reserva pois a data e hora atual ultrapassaram o intervalo de reserva (timeEnd - qtdTimeReservationEnd).
// Bloqueado: a refeição não está disponível para reserva pois o cardápio não está disponível (permission = false).
// Cancelado: a refeição foi cancelada pelo estudante (canceled_by_student = true).
// Reservado: a refeição foi reservada pelo estudante (agendado = true).
// Indisponivel: a refeição não está disponível para reserva pois a data e hora atual não estão dentro do intervalo de reserva ((timeStart - qtdTimeReservationStart) e (timeEnd - qtdTimeReservationEnd)).

/**
 * Retorna o status da refeição.
 * @param props - As propriedades da refeição.
 * @returns O status da refeição.
 */
export const pegarStatusDaRefeicao = (props: IRefeicaoComTurno): StatusDaRefeicao => {
    if (!(props.cardapio) || !(props.refeicao)) return "encerrado";
    if (!(props.cardapio.permission)) return "bloqueado";
    if (props.cardapio.canceled_by_student) return "cancelado";
    if (props.cardapio.agendado) return "reservado";

    const dataHoraDoComecoDaRefeicao = DatasHelper.compilarDataHora(props.cardapio.date, props.refeicao.timeStart);
    const diferencaEmHorasAteOComeco = DatasHelper.getDiferencaEmHoras(dataHoraDoComecoDaRefeicao);

    const dataHoraDoFimDaRefeicao = DatasHelper.compilarDataHora(props.cardapio.date, props.refeicao.timeEnd);
    const diferencaEmHorasAteOFim = DatasHelper.getDiferencaEmHoras(dataHoraDoFimDaRefeicao);

    if (diferencaEmHorasAteOComeco < 0 || diferencaEmHorasAteOFim < 0) return "encerrado";
    if (diferencaEmHorasAteOComeco > props.refeicao?.qtdTimeReservationStart) return "indisponivel";
    if (diferencaEmHorasAteOComeco < props.refeicao?.qtdTimeReservationEnd) return "indisponivel";
    return "disponivel";

}
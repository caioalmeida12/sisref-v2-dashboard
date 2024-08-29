"use server"

import { cookies } from "next/headers";

import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";
import { IRefeicao, IRefeicaoSchema } from "../elementos/interfaces/IRefeicao";
import { FetchHelper } from "../lib/actions/FetchHelper";


export async function fetchRefeicoesPorDia({ data = new Date().toISOString().split('T')[0] }: { data?: string }) {
    const resposta = await FetchHelper.get<IRefeicao>({
        rota: `/all/menus-today?date=${data}`,
        cookies: cookies(),
    })

    if (!resposta.sucesso) {
        return redirecionarViaAction(`/login?erro=${encodeURIComponent(resposta.message)}`)
    }

    const refeicoes = resposta.resposta.map((refeicao: any) => {
        // mapear o campo "meal" para o campo "refeicao" e utilizar o restante dos campos como "cardapio"
        const { meal, ...cardapio } = refeicao

        const formatar = IRefeicaoSchema.parse({
            refeicao: meal,
            cardapio: cardapio
        })

        return formatar
    })

    return refeicoes
}

// const mockRefeicoesComTodosOsStatus: IRefeicao[] = [
//     // Disponível
//     {
//         turno: 1,
//         refeicao: {
//             id: 1,
//             description: "Café da manhã",
//             qtdTimeReservationEnd: 1,
//             qtdTimeReservationStart: 8,
//             timeEnd: "18:00",
//             timeStart: "18:00",
//         },
//         cardapio: {
//             agendado: false,
//             date: "2024-07-11",
//             description: "Pão; café com leite; frutas",
//             permission: true,
//             id: 101,
//             campus_id: 1,
//             canceled_by_student: false,
//         },
//     },
//     // Encerrado por data
//     {
//         turno: 2,
//         refeicao: {
//             id: 2,
//             description: "Almoço",
//             qtdTimeReservationEnd: 1,
//             qtdTimeReservationStart: 1,
//             timeEnd: "18:00",
//             timeStart: "18:00",
//         },
//         cardapio: {
//             agendado: false,
//             date: "2024-07-10", // Data anterior à atual para simular encerrado
//             description: "Arroz; feijão; carne; salada; suco",
//             permission: true,
//             id: 102,
//             campus_id: 1,
//             canceled_by_student: false,
//         },
//     },
//     // // Encerrado por hora
//     // {
//     //     turno: 3,
//     //     refeicao: {
//     //         id: 2,
//     //         description: "Almoço",
//     //         qtdTimeReservationEnd: 1,
//     //         qtdTimeReservationStart: 1,
//     //         timeEnd: "13:00", // Horário anterior ao atual para simular encerrado
//     //         timeStart: "11:00",
//     //     },
//     //     cardapio: {
//     //         agendado: false,
//     //         date: "2024-07-11",
//     //         description: "Arroz; feijão; carne; salada; suco",
//     //         permission: true,
//     //         id: 102,
//     //         campus_id: 1,
//     //         canceled_by_student: false,
//     //     },
//     // },
//     // Bloqueado
//     {
//         turno: 4,
//         refeicao: {
//             id: 3,
//             description: "Jantar",
//             qtdTimeReservationEnd: 1,
//             qtdTimeReservationStart: 1,
//             timeEnd: "18:00",
//             timeStart: "17:00",
//         },
//         cardapio: {
//             agendado: false,
//             date: "2023-04-01",
//             description: "Sopa; pão; chá",
//             permission: false, // Não disponível para reserva
//             id: 103,
//             campus_id: 1,
//             canceled_by_student: false,
//         },
//     },
//     // Cancelado
//     // {
//     //     turno: 3,
//     //     refeicao: {
//     //         id: 4,
//     //         description: "Ceia",
//     //         qtdTimeReservationEnd: 1,
//     //         qtdTimeReservationStart: 1,
//     //         timeEnd: "21:00",
//     //         timeStart: "20:00",
//     //     },
//     //     cardapio: {
//     //         agendado: false,
//     //         date: "2023-04-01",
//     //         description: "Chá; biscoitos",
//     //         permission: true,
//     //         id: 104,
//     //         campus_id: 1,
//     //         canceled_by_student: true, // Cancelado pelo estudante
//     //     },
//     // },
//     // Reservado
//     {
//         turno: 3,
//         refeicao: {
//             id: 5,
//             description: "Lanche da tarde",
//             qtdTimeReservationEnd: 1,
//             qtdTimeReservationStart: 1,
//             timeEnd: "16:00",
//             timeStart: "15:00",
//         },
//         cardapio: {
//             agendado: true, // Reservado pelo estudante
//             date: "2023-04-01",
//             description: "Suco; sanduíche",
//             permission: true,
//             id: 105,
//             campus_id: 1,
//             canceled_by_student: false,
//         },
//     },
//     // // Indisponível (fora do intervalo de reserva)
//     // {
//     //     turno: 2,
//     //     refeicao: {
//     //         id: 6,
//     //         description: "Brunch",
//     //         qtdTimeReservationEnd: 5, // Ajustado para simular indisponibilidade
//     //         qtdTimeReservationStart: 5, // Ajustado para simular indisponibilidade
//     //         timeEnd: "11:00",
//     //         timeStart: "09:30",
//     //     },
//     //     cardapio: {
//     //         agendado: false,
//     //         date: "2023-04-01",
//     //         description: "Ovos; bacon; suco; café",
//     //         permission: true,
//     //         id: 106,
//     //         campus_id: 1,
//     //         canceled_by_student: false,
//     //     },
//     // }
// ];
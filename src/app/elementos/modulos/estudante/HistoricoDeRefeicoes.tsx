"use client"

import React, { useEffect, useState } from 'react'
import { Secao } from '@elementos/basicos/Secao'
import { CabecalhoDeSecao } from '@elementos/basicos/CabecalhoDeSecao'
import { RefeicaoDoHistorico, RefeicaoDoHistoricoLoading } from '@elementos/componentes/RefeicaoDoHistorico/RefeicaoDoHistorico'
import { useQuery } from '@tanstack/react-query'
import { buscarTickets, buscarTicketsSemJustificativa } from '@/app/actions/estudante'
import { IRefeicaoDoHistorico } from '@elementos/interfaces/IRefeicaoDoHistorico'

const QUANTOS_TICKETS_MOSTRAR = 10

export const HistoricoDeRefeicoes = ({ forcarExibicao = false }: { forcarExibicao?: boolean }) => {
    /**
     * Armazena os n tickets mais recentes dentre os 40 que são retornados pela API.
     */
    const [ticketsMaisRecentes, setTicketsMaisRecentes] = useState<IRefeicaoDoHistorico[]>([])

    const { data: tickets, isLoading, isError } = useQuery({
        queryKey: ['historicoDeRefeicoes'],
        queryFn: async () => {
            const aSerUtilizado = (await buscarTickets('a-ser-utilizado')).filter(ticket => ticket !== null)
            console.log(aSerUtilizado)
            const utilizado = (await buscarTickets('utilizado')).filter(ticket => ticket !== null)
            const cancelado = (await buscarTickets('cancelado')).filter(ticket => ticket !== null)
            const naoUtilizado = (await buscarTickets('nao-utilizado')).filter(ticket => ticket !== null)
            const naoUtilizadoSemJustificativa = (await buscarTicketsSemJustificativa()).filter(ticket => ticket !== null)

            return {
                aSerUtilizado,
                utilizado,
                cancelado,
                naoUtilizado,
                naoUtilizadoSemJustificativa
            }
        }
    })

    useEffect(() => {
        const todosSaoArray =
            tickets
            && Array.isArray(tickets.aSerUtilizado)
            && Array.isArray(tickets.utilizado)
            && Array.isArray(tickets.cancelado)
            && Array.isArray(tickets.naoUtilizado)
            && Array.isArray(tickets.naoUtilizadoSemJustificativa)

        if (!todosSaoArray) return

        // Adiciona o status de cada ticket para que possa ser exibido no componente.
        tickets.aSerUtilizado.forEach(ticket => ticket!.status = 'a-ser-utilizado')
        tickets.utilizado.forEach(ticket => ticket!.status = 'utilizado')
        tickets.cancelado.forEach(ticket => ticket!.status = 'cancelado')
        tickets.naoUtilizado.forEach(ticket => {
            ticket!.absenceJustification ?
                ticket!.status = 'justificado' :
                ticket!.status = 'nao-utilizado'
        })
        tickets.naoUtilizadoSemJustificativa.forEach(ticket => ticket!.status = 'nao-utilizado-sem-justificativa')

        const todosTickets = [...tickets.aSerUtilizado, ...tickets.utilizado, ...tickets.cancelado, ...tickets.naoUtilizado]
        const todosTicketsOrdenados = todosTickets.sort((a, b) => {
            return new Date(b!.meal.date).getTime() - new Date(a!.meal.date).getTime()
        })

        const ticketsMaisRecentes = todosTicketsOrdenados.slice(0, QUANTOS_TICKETS_MOSTRAR)

        // Sempre mantém os tickets sem justificativa no início da lista.
        const concatenarTicketsETicketsSemJustificativa = [...tickets.naoUtilizadoSemJustificativa, ...ticketsMaisRecentes] as IRefeicaoDoHistorico[]

        setTicketsMaisRecentes(concatenarTicketsETicketsSemJustificativa)
    }, [tickets])

    return (
        <Secao className={`${forcarExibicao ? "flex" : "hidden"} lg:flex flex-col gap-y-4`}>
            <CabecalhoDeSecao titulo='Histórico de Refeições' />
            <div className='flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4'>
                {
                    isLoading &&
                    Array.from({ length: QUANTOS_TICKETS_MOSTRAR }).map((_, index) => (
                        <RefeicaoDoHistoricoLoading key={index} />
                    ))

                }
                {
                    !isLoading && !isError &&
                    ticketsMaisRecentes.map((refeicao, index) => (
                        <RefeicaoDoHistorico key={index} {...menu} />
                    ))
                }
                {
                    isError &&
                    <p>Não foi possível carregar o histórico de refeições</p>
                }
            </div>
        </Secao>
    )
}
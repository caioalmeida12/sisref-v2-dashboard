"use client"

import React, { useEffect, useState } from 'react'
import { Secao } from '../basicos/Secao'
import { CabecalhoDeSecao } from '../basicos/CabecalhoDeSecao'
import { fetchTickets } from '@/app/actions/fetchTickets'
import { IRefeicaoDoHistorico } from '../interfaces/IRefeicaoDoDoHistorico'
import { RefeicaoDoHistorico } from '../componentes/RefeicaoDoHistorico'

const QUANTOS_TICKETS_MOSTRAR = 10

export const HistoricoDeRefeicoesProps = () => {
    const [aSerUtilizado, setASerUtilizado] = useState<IRefeicaoDoHistorico[]>([])
    const [utilizado, setUtilizado] = useState<IRefeicaoDoHistorico[]>([])
    const [cancelado, setCancelado] = useState<IRefeicaoDoHistorico[]>([])
    const [naoUtilizado, setNaoUtilizado] = useState<IRefeicaoDoHistorico[]>([])

    /**
     * Armazena os n tickets mais recentes dentre os 40 que são retornados pela API.
     */
    const [ticketsMaisRecentes, setTicketsMaisRecentes] = useState<IRefeicaoDoHistorico[]>([])

    useEffect(() => {
        fetchTickets('a-ser-utilizado').then(setASerUtilizado)
        fetchTickets('utilizado').then(setUtilizado)
        fetchTickets('cancelado').then(setCancelado)
        fetchTickets('nao-utilizado').then(setNaoUtilizado)
    }, [])

    useEffect(() => {
        const todosSaoArray = [aSerUtilizado, utilizado, cancelado, naoUtilizado].every(Array.isArray)
        if (!todosSaoArray) return

        // Adiciona o status de cada ticket para que possa ser exibido no componente.
        aSerUtilizado.forEach(ticket => ticket.status = 'a-ser-utilizado')
        utilizado.forEach(ticket => ticket.status = 'utilizado')
        cancelado.forEach(ticket => ticket.status = 'cancelado')
        naoUtilizado.forEach(ticket => ticket.status = 'nao-utilizado')

        const todosTickets = [...aSerUtilizado, ...utilizado, ...cancelado, ...naoUtilizado]
        const todosTicketsOrdenados = todosTickets.sort((a, b) => {
            return new Date(b.cardapio.date).getTime() - new Date(a.cardapio.date).getTime()
        })

        const ticketsMaisRecentes = todosTicketsOrdenados.slice(0, QUANTOS_TICKETS_MOSTRAR)

        setTicketsMaisRecentes(ticketsMaisRecentes)
    }, [aSerUtilizado, utilizado, cancelado, naoUtilizado])

    return (
        <Secao className='flex flex-col gap-y-4'>
            <CabecalhoDeSecao titulo='Histórico de Refeições' />
            <div className='flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4'>
            {
                ticketsMaisRecentes.map((refeicao, index) => (
                    <RefeicaoDoHistorico key={index} {...refeicao} />
                ))
            }
            </div>
        </Secao>
    )
}
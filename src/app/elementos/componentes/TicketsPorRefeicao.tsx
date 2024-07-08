"use client"

import React, { CanvasHTMLAttributes, DetailedHTMLProps } from "react"
import { Chart, registerables } from "chart.js"
import { useLayoutEffect, useRef } from "react"
import { coresDosGraficos } from "@/app/lib/elementos/CoresDosGraficos"

interface TicketsPorRefeicaoProps {
    refeicao: string,
    tickets: {
        estado: string,
        quantidade: number
    }[]
}

export const TicketsPorRefeicao = ({ tickets, refeicao, ...rest }: TicketsPorRefeicaoProps & DetailedHTMLProps<CanvasHTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
    const elementoCanvas = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<Chart<"doughnut", number[], string> | null>(null)

    useLayoutEffect(() => {
        if (!elementoCanvas.current) return

        const ctx = elementoCanvas.current.getContext("2d")
        if (!ctx) return

        Chart.register(...registerables)

        if (chartRef.current) {
            chartRef.current.destroy()
            chartRef.current = null
        }

        chartRef.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: tickets.map(ticket => ticket.estado),
                datasets: [{
                    data: tickets.map(ticket => ticket.quantidade),
                    backgroundColor: coresDosGraficos,
                }],
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `Tickets para o ${refeicao}`,
                    },
                },
            },
        })

    }, [tickets, refeicao])

    return (
        <div {...rest}>
            <canvas ref={elementoCanvas} />
        </div>
    )
}
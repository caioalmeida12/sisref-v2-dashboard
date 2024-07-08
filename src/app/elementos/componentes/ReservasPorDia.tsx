"use client"

import React, { CanvasHTMLAttributes, DetailedHTMLProps } from "react"
import { Chart, registerables } from "chart.js"
import { useLayoutEffect, useRef } from "react"
import { coresDosGraficos } from "@/app/lib/elementos/CoresDosGraficos"

interface ReservasPorDiaProps {
    textoDoCabecalho: string,
    data: string,
    refeicoes: {
        nome: string,
        quantidade: number
    }[]
}

export default function ReservasPorDia({ textoDoCabecalho, data, refeicoes, ...rest }: ReservasPorDiaProps & DetailedHTMLProps<CanvasHTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    const elementoCanvas = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<Chart | null>(null)

    useLayoutEffect(() => {
        if (!elementoCanvas.current) return

        const ctx = elementoCanvas.current.getContext("2d")
        if (!ctx) return

        Chart.register(...registerables)

        const nomes = refeicoes.map(refeicao => refeicao.nome)
        const quantidades = refeicoes.map(refeicao => refeicao.quantidade)

        if (chartRef.current) {
            chartRef.current.destroy()
            chartRef.current = null
        }

        chartRef.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: nomes,
                datasets: [{
                    data: quantidades,
                    backgroundColor: coresDosGraficos,
                }],
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: textoDoCabecalho,
                    },
                    subtitle: {
                        display: true,
                        text: data,
                        position: "bottom",
                        padding: {
                            top: 10,
                        },
                        font: {
                            weight: "bold",
                        },
                    },
                    legend: {
                        display: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    },
                },
            }
        })
    }, [textoDoCabecalho, refeicoes, data])

    return (
        <div {...rest}>
            <canvas ref={elementoCanvas}/>
        </div>
    )
}
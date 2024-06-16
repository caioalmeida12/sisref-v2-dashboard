"use client"

import { Chart, registerables } from "chart.js"
import { useLayoutEffect, useRef } from "react"

export default function BarChart() {
    const elementoCanvas = useRef<HTMLCanvasElement>(null)
    let grafico: Chart | null = null

    useLayoutEffect(() => {
        if (!elementoCanvas.current) return
        if (grafico) {
            grafico.destroy()
            grafico = null
        }

        const ctx = elementoCanvas.current.getContext("2d")
        if (!ctx) return

        Chart.register(...registerables)

        grafico = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"],
                datasets: [{
                    label: "Vendas",
                    data: [10, 20, 30, 40, 50],
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    }, [])

    return (
        <canvas ref={elementoCanvas} />
    )
}
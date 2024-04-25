"use client"

import { Footer } from "@/app/elementos/componentes/Footer";
import { Navbar } from "@/app/elementos/modulos/Navbar";
import React, { Suspense, useEffect } from "react";

export default function RootLayout({
    children,
    refeicoesPorDia,
    restricoesAlimentares,
    historicoDeRefeicoes,
    refeicoesAutorizadas,

}: Readonly<{
    children: React.ReactNode;
    refeicoesPorDia: React.ReactNode;
    restricoesAlimentares: React.ReactNode;
    historicoDeRefeicoes: React.ReactNode;
    refeicoesAutorizadas: React.ReactNode;
}>) {
    const [versaoMobile, setVersaoMobile] = React.useState(true);
    const [paginaParaMostrar, setPaginaParaMostrar] = React.useState<React.ReactNode>();

    useEffect(() => {
        const detectarVersaoMobile = () => {
            if (window.innerWidth < 768) {
                setVersaoMobile(true);
            } else {
                setVersaoMobile(false);
            }
        }

        detectarVersaoMobile();

        window.addEventListener('resize', detectarVersaoMobile);
    }, []);

    useEffect(() => {
        const elementoPorPagina = {
            refeicoesPorDia,
            refeicoesAutorizadas,
            restricoesAlimentares,
            historicoDeRefeicoes,
        } as const

        const searchParams = new URLSearchParams(window.location.search);

        const paginaSolicitada = searchParams.get('pagina');

        setPaginaParaMostrar(elementoPorPagina[paginaSolicitada as keyof typeof elementoPorPagina] || refeicoesPorDia)
    }, [historicoDeRefeicoes, refeicoesAutorizadas, refeicoesPorDia, restricoesAlimentares, versaoMobile]);

    return (
        <>
            <Navbar navItems={[
                {
                    titulo: 'Refeições', rota: '?pagina=refeicoesPorDia',
                },
                {
                    titulo: 'Histórico de refeições', rota: '?pagina=historicoDeRefeicoes',
                },
                {
                    titulo: 'Restrições alimentares', rota: '?pagina=restricoesAlimentares',
                },
                {
                    titulo: 'Refeições autorizadas', rota: '?pagina=refeicoesAutorizadas',
                },
            ]} />

            <main className='w-full grid gap-y-8 px-6 my-8'>
                {children}
                <Suspense fallback={<div>Carregando suspense...</div>}>
                    {versaoMobile ? (paginaParaMostrar) : (
                        <>
                            {refeicoesPorDia}
                            {restricoesAlimentares}
                            {historicoDeRefeicoes}
                            {refeicoesAutorizadas}
                        </>
                    )}
                </Suspense>
            </main>
            <Footer />
        </>
    );
}

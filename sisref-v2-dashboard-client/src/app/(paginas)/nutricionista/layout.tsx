import { Footer } from "@/app/elementos/componentes/Footer";
import { Cardapios } from "@/app/elementos/modulos/Cardapios";
import { InformacoesDeEstudante } from "@/app/elementos/modulos/InformacoesDeEstudante";
import { Navbar } from "@/app/elementos/modulos/Navbar";
import { RelatoriosDeDesperdicio } from "@/app/elementos/modulos/RelatoriosDeDesperdicio";
import React from "react";

interface NutricionistaLayoutProps {
    children: React.ReactNode;
}

export default function NutricionistaLayout({ children }: NutricionistaLayoutProps) {
    return (
        <>
            <Navbar navItems={[
                {
                    titulo: 'Estatísticas',
                    isDropdown: true,
                    itens: [
                        { titulo: 'Item 1', rota: '#' },
                        { titulo: 'Item 2', rota: '#' },
                        { titulo: 'Item 3', rota: '#' },
                    ],
                },
                {
                    titulo: 'Cardápios', rota: '?pagina=historicoDeRefeicoes',
                },
                {
                    titulo: 'Refeições', rota: '?pagina=restricoesAlimentares',
                },
                {
                    titulo: 'Relatórios', rota: '?pagina=refeicoesAutorizadas',
                },
                {
                    titulo: 'Avisos', rota: '?pagina=refeicoesAutorizadas',
                },
            ]}
            />

            <main className='w-full grid gap-y-8 px-6 my-8 lg:grid lg:grid-cols-12 lg:gap-x-8 max-w-screen-xl mx-auto'>
                <div className="col-left flex flex-col gap-y-8">
                    {children}
                    <InformacoesDeEstudante />
                    <Cardapios />
                    <RelatoriosDeDesperdicio  data="2023-03-03"/>
                </div>
                <div className="col-right flex flex-col gap-y-8 lg:row-start-1 lg:row-span-3">
                </div>
            </main>
            <Footer />
        </>
    );
}
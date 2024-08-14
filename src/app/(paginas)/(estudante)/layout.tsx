import { Footer } from "@/app/elementos/componentes/Footer";
import { Navbar } from "@/app/elementos/modulos/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next"
import React from "react";

interface EstudanteLayoutProps {
    children: React.ReactNode;
    refeicoesPorDia: React.ReactNode;
    restricoesAlimentares: React.ReactNode;
    historicoDeRefeicoes: React.ReactNode;
    refeicoesAutorizadas: React.ReactNode;
}

/**
 * Layout padrão para páginas de estudante.
 * 
 * Este layout utiliza-se da função de rotas paralelas do Next.js para renderizar múltiplas páginas em uma única rota.
 * Essa funcionalidade é necessária para que a página de estudante seja renderizada como SPA no desktop e seja repartida em múltiplas páginas no mobile.
 * 
 * Para entender melhor como funciona a função de rotas paralelas, consulte a documentação do Next.js: 
 * Rotas dinâmicas: https://nextjs.org/docs/routing/dynamic-routes
 * Rotas paralelas: https://nextjs.org/docs/app/building-your-application/routing/parallel-routes
 */
export default function EstudanteLayout({ children, refeicoesPorDia, historicoDeRefeicoes, refeicoesAutorizadas }: EstudanteLayoutProps) {
    return (
        <>
            <SpeedInsights />
            <Navbar navItems={[
                {
                    titulo: 'Refeições', rota: '?pagina=refeicoesPorDia',
                },
                {
                    titulo: 'Histórico de refeições', rota: '?pagina=historicoDeRefeicoes',
                },
                // {
                //     titulo: 'Restrições alimentares', rota: '?pagina=restricoesAlimentares',
                // },
                {
                    titulo: 'Refeições autorizadas', rota: '?pagina=refeicoesAutorizadas',
                },
                {
                    titulo: 'Dropdown',
                    isDropdown: true,
                    itens: [
                        { titulo: 'Item 1', rota: '#' },
                        { titulo: 'Item 2', rota: '#' },
                        { titulo: 'Item 3', rota: '#' },
                    ],
                },
            ]}
            />

            <main className='w-full grid gap-y-8 px-6 my-8 lg:grid lg:grid-cols-12 lg:gap-x-8 max-w-screen-xl mx-auto'>
                <div className="col-left flex flex-col gap-y-8">
                    {children}
                    {/* {restricoesAlimentares} */}
                    {refeicoesAutorizadas}
                </div>
                <div className="col-right flex flex-col gap-y-8 lg:row-start-1 lg:row-span-3">
                    {refeicoesPorDia}
                    {historicoDeRefeicoes}
                </div>
            </main>
            <Footer />
        </>
    );
}
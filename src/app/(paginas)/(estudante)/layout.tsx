import { Footer } from "@/app/elementos/componentes/Footer";
import { Navbar } from "@/app/elementos/modulos/comuns/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import { SidebarProvider } from "@/app/elementos/shadcn/components/ui/sidebar";
import { SidebarEstudante } from "@/app/elementos/modulos/estudante/Sidebar/SidebarEstudante";

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
export default function EstudanteLayout({
  children,
  refeicoesPorDia,
  historicoDeRefeicoes,
  refeicoesAutorizadas,
}: EstudanteLayoutProps) {
  return (
    <>
      <SpeedInsights />
      <Analytics />
      <SidebarProvider className="contents">
        <Navbar
          navItems={[
            {
              titulo: "Refeições",
              rota: "?pagina=refeicoesPorDia",
            },
            {
              titulo: "Histórico de refeições",
              rota: "?pagina=historicoDeRefeicoes",
            },
            // {
            //     titulo: 'Restrições alimentares', rota: '?pagina=restricoesAlimentares',
            // },
            {
              titulo: "Refeições autorizadas",
              rota: "?pagina=refeicoesAutorizadas",
            },
            {
              titulo: "Dropdown",
              isDropdown: true,
              itens: [
                { titulo: "Item 1", rota: "#" },
                { titulo: "Item 2", rota: "#" },
                { titulo: "Item 3", rota: "#" },
              ],
            },
          ]}
        />
        <SidebarEstudante />
        <main className="mx-auto my-8 grid w-full max-w-screen-xl gap-y-8 px-6 lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="col-left flex flex-col gap-y-8">
            {children}
            {/* {restricoesAlimentares} */}
            {refeicoesAutorizadas}
          </div>
          <div className="col-right flex flex-col gap-y-8 lg:row-span-3 lg:row-start-1">
            {refeicoesPorDia}
            {historicoDeRefeicoes}
          </div>
        </main>
        <Footer />
      </SidebarProvider>
    </>
  );
}

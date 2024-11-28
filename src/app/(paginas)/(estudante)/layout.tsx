import { Footer } from "@/app/elementos/componentes/Footer";
import { Navbar } from "@/app/elementos/modulos/comuns/Navbar";
import { SidebarEstudante } from "@/app/elementos/modulos/estudante/Sidebar/SidebarEstudante";
import { SidebarProvider } from "@/app/elementos/shadcn/components/ui/sidebar";
import { CustomQueryClientProvider } from "@/app/lib/elementos/CustomQueryProviderWrapper";
import { linksDaSidebarPorTipoDeUsuario } from "@/app/lib/elementos/LinksDaSidebarPorTipoDeUsuario";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
export default function EstudanteLayout({ children }: EstudanteLayoutProps) {
  return (
    <>
      <SpeedInsights />
      <Analytics />
      <CustomQueryClientProvider>
        <SidebarProvider className="contents" defaultOpen={false}>
          <Navbar navItems={linksDaSidebarPorTipoDeUsuario["STUDENT"]} />
          <SidebarEstudante />
          <main className="mx-auto my-8 grid w-full max-w-screen-xl gap-y-8 px-6 lg:grid lg:grid-cols-12 lg:gap-x-8">
            {children}
          </main>
          <Footer />
        </SidebarProvider>
      </CustomQueryClientProvider>
    </>
  );
}

import { Sidebar } from "@/app/elementos/modulos/comuns/Sidebar";
import { CustomQueryClientProvider } from "@/app/lib/elementos/CustomQueryProviderWrapper";
// import { validarTokenDosCookies } from "@/app/lib/middlewares/ValidarTokenDosCookies";
import React, { Suspense } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface NutricionistaLayoutProps {
  children: React.ReactNode;
}

export default async function NutricionistaLayout({
  children,
}: NutricionistaLayoutProps) {
  // const decodificado = validarTokenDosCookies()

  return (
    <CustomQueryClientProvider>
      <div className="flex">
        <Sidebar />
        <div className="max-h-screen w-full overflow-y-auto p-8">
          <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </CustomQueryClientProvider>
  );
}

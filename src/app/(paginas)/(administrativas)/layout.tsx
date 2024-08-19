import { Sidebar } from "@/app/elementos/modulos/Sidebar";
import { CustomQueryClientProvider } from "@/app/lib/elementos/CustomQueryProviderWrapper";
// import { validarTokenDosCookies } from "@/app/lib/middlewares/ValidarTokenDosCookies";
import React from "react";

interface NutricionistaLayoutProps {
    children: React.ReactNode;
}

export default async function NutricionistaLayout({ children }: NutricionistaLayoutProps) {
    // const decodificado = validarTokenDosCookies()

    return (
        <CustomQueryClientProvider>
            <div className="flex">
                <Sidebar />
                <div className="block">
                    {children}
                </div>
            </div>
        </CustomQueryClientProvider>
    );
}
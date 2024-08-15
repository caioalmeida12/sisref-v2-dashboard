import { Footer } from "@/app/elementos/componentes/Footer";
import EstatisticasDeHoje from "@/app/elementos/modulos/EstatisticasDeHoje";
import { Navbar } from "@/app/elementos/modulos/Navbar";
import { Sidebar } from "@/app/elementos/modulos/Sidebar";
import { CustomQueryClientProvider } from "@/app/lib/elementos/CustomQueryProviderWrapper";
import { validarTokenDosCookies } from "@/app/lib/middlewares/ValidarTokenDosCookies";
import { cookies } from "next/headers";
import React from "react";

interface NutricionistaLayoutProps {
    children: React.ReactNode;
}

export default async function NutricionistaLayout({ children }: NutricionistaLayoutProps) {
    const decodificado = validarTokenDosCookies()

    return (
        <Sidebar token_decodificado={decodificado} />
    );
}
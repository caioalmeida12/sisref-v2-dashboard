"use client"

import React from "react";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { Botao } from "../../basicos/Botao";
import { Secao } from "../../basicos/Secao";

export default function Card({ children, data }: { children: React.ReactNode, data: string }) {
    return (
        <Secao className="flex flex-col gap-y-2 bg-azul-400">
            <p className="font-bold">{DatasHelper.converterParaFormatoBrasileiro(data)}</p>

            <div onClick={() => console.log(data)}>
                {children}
            </div>

            <Botao variante="remover" texto="Remover"></Botao>
        </Secao>
    )
}
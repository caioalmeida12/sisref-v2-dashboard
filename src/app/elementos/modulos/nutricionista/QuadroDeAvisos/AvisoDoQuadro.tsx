"use client";

import React from "react";
import { Botao } from "@elementos/basicos/Botao";

interface AvisoProps {
  titulo: string;
  texto: string;
  textoBotao?: string;
}

export const AvisoDoQuadro = ({ titulo, texto }: AvisoProps) => {
  return (
    <div className="flex flex-col gap-x-2 gap-y-4 rounded border-[1px] border-cinza-600 p-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-x-2 font-bold">{titulo}</h2>
      </div>
      <p>{texto}</p>
      <Botao texto="Remover" variante="remover" />
    </div>
  );
};

"use client";

import React from "react";

import { MouseEventHandler } from "react";
import Icone from "./Icone";

interface RestricaoAlimentarProps {
  texto: string;
  onRemove?: MouseEventHandler<HTMLButtonElement>;
}

export const RestricaoAlimentar = ({
  texto,
  onRemove,
}: RestricaoAlimentarProps) => {
  return (
    <div className="item-center relative flex justify-between rounded border-[1px] border-cinza-600 p-4">
      <div className="relative flex items-center gap-2">
        <Icone.RestricaoAlimentar />
        <p className="text-sm font-bold leading-4 text-preto-400">{texto}</p>
      </div>
      <div className="relative flex items-center gap-2 text-vermelho-400 hover:font-medium">
        <button name="Remover" onClick={onRemove} className="cursor-pointer">
          Remover
        </button>
      </div>
    </div>
  );
};

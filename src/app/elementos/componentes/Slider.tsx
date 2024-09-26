"use client";

import React from "react";
import Icone from "@elementos/basicos/Icone";

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  texto: string;
  tooltip?: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const Slider = ({
  texto,
  onPrevious,
  onNext,
  tooltip,
  ...rest
}: SliderProps) => {
  return (
    <div
      className={`${rest.className} flex items-center justify-between rounded bg-cinza-600 p-4 text-center font-bold text-branco-400`}
    >
      <button
        name="Ver dia anterior"
        onClick={onPrevious}
        className='relative before:inset-[-.5em] before:rounded before:bg-branco-400 before:opacity-10 before:content-[""] hover:before:absolute'
      >
        <Icone.Seta fill="fill-branco-400" direcao="esquerda" />
      </button>
      <span className="flex justify-center gap-x-2">
        {texto}
        {tooltip}
      </span>
      <button
        name="Ver dia posterior"
        onClick={onNext}
        className='relative before:inset-[-.5em] before:rounded before:bg-branco-400 before:opacity-10 before:content-[""] hover:before:absolute'
      >
        <Icone.Seta fill="fill-branco-400" direcao="direita" />
      </button>
    </div>
  );
};

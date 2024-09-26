"use client";

import React from "react";

import Link from "next/link";
import Icone from "@elementos/basicos/Icone";

interface SliderServerSideProps extends React.HTMLAttributes<HTMLDivElement> {
  texto: string;
  tooltip?: React.ReactNode;
  onNext: string;
  onPrevious: string;
}

export const SliderServerSide = ({
  texto,
  onPrevious,
  onNext,
  tooltip,
  ...rest
}: SliderServerSideProps) => {
  return (
    <div
      className={`${rest.className} flex items-center justify-between rounded bg-cinza-600 p-4 text-center font-bold text-branco-400`}
    >
      <Link
        href={onPrevious}
        replace
        scroll={false}
        className='relative before:inset-[-.5em] before:rounded before:bg-branco-400 before:opacity-10 before:content-[""] hover:before:absolute'
      >
        <Icone.Seta fill="fill-branco-400" direcao="esquerda" />
      </Link>
      <span className="flex justify-center gap-x-2">
        {texto}
        {tooltip}
      </span>
      <Link
        href={onNext}
        replace
        scroll={false}
        className='relative before:inset-[-.5em] before:rounded before:bg-branco-400 before:opacity-10 before:content-[""] hover:before:absolute'
      >
        <Icone.Seta fill="fill-branco-400" direcao="direita" />
      </Link>
    </div>
  );
};

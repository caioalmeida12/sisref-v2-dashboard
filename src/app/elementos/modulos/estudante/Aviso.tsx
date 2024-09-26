"use client";

import React, { useRef } from "react";

import { Botao } from "@elementos/basicos/Botao";

import { toggle } from "slide-element";
import Icone from "@elementos/basicos/Icone";

interface AvisoProps {
  titulo: string;
  texto: string;
  textoBotao?: string;
}

export const Aviso = ({ titulo, texto, textoBotao }: AvisoProps) => {
  const elementoPai = useRef<HTMLDivElement>(null);
  const elementoConteudo = useRef<HTMLParagraphElement>(null);
  const tempoPressionado = useRef<number>(0);

  const iniciarPressionamento = () => {
    tempoPressionado.current = Date.now();
  };

  const finalizarPressionamento = () => {
    if (Date.now() - tempoPressionado.current < 200) {
      alterarVisibilidade(elementoConteudo.current);
    }
  };

  const alterarVisibilidade = (elemento: HTMLElement | null) => {
    if (!elemento) return;

    const estaAberto =
      elementoPai.current?.getAttribute("data-state") === "open";
    const proximoEstado = !estaAberto;
    const proximoEstadoString = proximoEstado ? "open" : "closed";

    elementoPai.current?.setAttribute("data-state", proximoEstadoString);

    toggle(elemento);
  };

  return (
    <div
      className="col-left group peer gap-x-2 gap-y-4 rounded bg-vermelho-400 p-4 text-branco-400"
      ref={elementoPai}
      data-state="open"
      onMouseDown={iniciarPressionamento}
      onMouseUp={finalizarPressionamento}
    >
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-x-2 font-bold text-branco-400">
          <Icone.Aviso />
          {titulo}
        </h2>
        <button
          name="Ver mais / Ver menos"
          className='relative before:inset-[-.5em] before:rounded before:bg-branco-400 before:opacity-10 before:content-[""] hover:before:absolute'
        >
          <Icone.Dropdown />
        </button>
      </div>
      <div className="transition-all duration-300" ref={elementoConteudo}>
        <p className="mb-4 mt-4 opacity-0 transition-opacity group-data-[state=open]:opacity-100">
          {texto}
        </p>
        <Botao texto={textoBotao || "Entendido"} variante="ocultar" />
      </div>
    </div>
  );
};

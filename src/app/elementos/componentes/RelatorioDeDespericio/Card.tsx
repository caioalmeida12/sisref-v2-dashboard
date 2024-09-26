"use client";

import React, { useLayoutEffect } from "react";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { Botao } from "@elementos/basicos/Botao";
import { Secao } from "@elementos/basicos/Secao";
import { Modal } from "./Modal";

export default function Card({
  children,
  data,
}: {
  children: React.ReactNode;
  data: string;
}) {
  useLayoutEffect(() => {
    const modal = document.querySelector(`#modal-${data}`) as HTMLDialogElement;
    modal.close();
  }, [data]);

  const handleClick = () => {
    const modal = document.querySelector(`#modal-${data}`) as HTMLDialogElement;
    modal.showModal();
  };

  return (
    <>
      <Modal titulo="Relatório de desperdício" id={`modal-${data}`}>
        {children}
      </Modal>

      <Secao
        className="flex cursor-pointer flex-col gap-y-2 bg-azul-400 outline-1 outline-preto-400 hover:outline"
        onClick={handleClick}
      >
        <p className="font-bold">
          {DatasHelper.converterParaFormatoBrasileiro(data)}
        </p>

        {children}

        <Botao variante="remover" texto="Remover"></Botao>
      </Secao>
    </>
  );
}

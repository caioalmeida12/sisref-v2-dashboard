"use client";

import React from "react";
import { useLayoutEffect, useRef } from "react";
import Icone from "@elementos/basicos/Icone";

const useModal = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    modal.showModal();
    return () => modal.close();
  }, []);

  const handleClose = () => modalRef.current?.close();

  return { modalRef, handleClose };
};

export const Modal = ({
  children,
  titulo,
  id,
}: {
  children: React.ReactNode;
  titulo: string;
  id?: string;
}) => {
  const { modalRef, handleClose } = useModal();

  const handleKeyDown = (event: React.KeyboardEvent) =>
    event.key === "Enter" && handleClose();

  return (
    <dialog
      id={id || ""}
      ref={modalRef}
      className="fixed inset-8 bottom-8 z-10 my-8 max-h-[calc(100svh-8rem)] max-w-[768px] overflow-y-auto rounded px-6 py-4 backdrop:bg-preto-400/15 backdrop:backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between gap-x-4">
        <h2 className="text-xl font-bold">{titulo}</h2>
        <Icone.Fechar
          onClick={handleClose}
          onKeyDown={handleKeyDown}
          tabIndex={1}
          className="fill-cinza-600"
        />
      </div>
      {children}
    </dialog>
  );
};

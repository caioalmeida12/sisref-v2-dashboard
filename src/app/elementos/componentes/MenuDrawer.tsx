"use client";

import React from "react";

import { INavbarProps } from "@/app/interfaces/INavbarProps";
import { useState } from "react";
import { NavbarNavigation } from "../modulos/comuns/Navbar";
import Icone from "@elementos/basicos/Icone";

export const MenuDrawer = ({ navItems }: INavbarProps) => {
  const [aberto, setAberto] = useState(false);

  const IconeFecharSeAberto = aberto && (
    <div className="flex justify-end px-6 py-4">
      <Icone.Fechar onClick={() => setAberto(false)} />
    </div>
  );

  const ConteudoSeAberto = aberto && (
    <div
      className={`flex flex-col gap-y-4 px-4 transition-all ${aberto ? "opacity-100" : "opacity-0"} md:px-[3em]`}
    >
      <NavbarNavigation navItems={navItems} />
    </div>
  );

  return (
    <>
      <Icone.Menu onClick={() => setAberto(true)} />
      <div
        className={`fixed left-0 top-0 z-20 flex h-full w-0 flex-col gap-y-4 bg-verde-400 transition-all ${aberto ? "w-60 lg:w-80" : "w-0"} `}
      >
        {IconeFecharSeAberto}
        {ConteudoSeAberto}
      </div>
    </>
  );
};

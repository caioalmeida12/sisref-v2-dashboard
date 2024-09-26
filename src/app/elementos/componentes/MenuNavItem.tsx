"use client";

import React from "react";

import { INavItemSemDropdown } from "@/app/interfaces/INavbarProps";
import Link from "next/link";

export const MenuNavItem = ({ titulo, rota }: INavItemSemDropdown) => {
  const createHandleMenuClick = (menuItem: string) => {
    return () => {
      console.log(`Clicked on ${menuItem}`);
    };
  };

  return (
    <Link
      className="flex cursor-pointer items-center gap-x-2"
      onClick={createHandleMenuClick(titulo)}
      href={rota}
    >
      {titulo}
    </Link>
  );
};

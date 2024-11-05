"use client";

import Icone from "@/app/elementos/basicos/Icone";
import { useSidebar } from "@/app/elementos/shadcn/components/ui/sidebar";
import { IItemDaSidebar } from "@/app/interfaces/ISidebar";
import Link from "next/link";
import React from "react";

export default function SidebarEstudanteLink({
  item,
}: {
  item: IItemDaSidebar;
}) {
  const { isMobile, setOpen } = useSidebar();

  if (!item.isDropdown)
    return (
      <Link
        href={isMobile ? `?pagina=${item.rota}` : `#${item.rota}`}
        onClick={() => setOpen(false)}
        className="flex gap-x-2 hover:bg-branco-400/10 hover:text-branco-400"
      >
        {React.createElement(Icone[item.icone] as any)}
        <span>{item.titulo}</span>
      </Link>
    );

  if (item.isDropdown) return null;
}

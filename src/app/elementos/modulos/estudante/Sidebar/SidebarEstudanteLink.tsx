"use client";

import Icone from "@/app/elementos/basicos/Icone";
import { useSidebar } from "@/app/elementos/shadcn/components/ui/sidebar";
import { IItemDaSidebar } from "@/app/interfaces/ISidebar";
import { useNavegacaoDaPaginaDeEstudante } from "@/app/lib/elementos/NavegacaoDaPaginaDeEstudante";
import React from "react";

export default function SidebarEstudanteLink({
  item,
}: {
  item: IItemDaSidebar;
}) {
  const { setOpen, setOpenMobile } = useSidebar();
  const [navegacao, setNavegacao] = useNavegacaoDaPaginaDeEstudante();

  if (!item.isDropdown)
    return (
      <span
        onClick={() => {
          setOpen(false);
          setOpenMobile(false);

          if (navegacao.isMobile) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return setNavegacao({ pagina: `${item.rota}` });
          }

          return window.document
            .querySelector(`#${item.rota}`)
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className="flex items-center gap-x-2 rounded px-2 py-1 hover:bg-branco-400/10 hover:text-branco-400"
      >
        {React.createElement(Icone[item.icone] as any)}
        <span>{item.titulo}</span>
      </span>
    );

  if (item.isDropdown) return null;
}

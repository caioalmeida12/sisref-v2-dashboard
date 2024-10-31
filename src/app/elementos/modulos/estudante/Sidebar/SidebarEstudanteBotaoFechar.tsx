"use client";
import Icone from "@/app/elementos/basicos/Icone";
import { useSidebar } from "@/app/elementos/shadcn/components/ui/sidebar";

export function SidebarEstudanteBotaoFechar() {
  const { toggleSidebar } = useSidebar();

  return (
    <div
      className="absolute right-4 top-4 z-50 cursor-pointer"
      onClickCapture={toggleSidebar}
    >
      <Icone.Fechar></Icone.Fechar>
    </div>
  );
}

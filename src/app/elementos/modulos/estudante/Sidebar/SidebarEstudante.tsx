import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/elementos/shadcn/components/ui/sidebar";
import { SidebarEstudanteBotaoFechar } from "./SidebarEstudanteBotaoFechar";
import { linksDaSidebarPorTipoDeUsuario } from "@/app/lib/elementos/LinksDaSidebarPorTipoDeUsuario";
import Icone from "@/app/elementos/basicos/Icone";
import React from "react";
import { buscarCampus } from "@/app/actions/campus";
import { buscarEstudante } from "@/app/actions/estudante";
import { validarTokenDosCookies } from "@/app/lib/middlewares/ValidarTokenDosCookies";
import Image from "next/image";
import { stringParaCamelCase } from "@/app/lib/elementos/StringParaCamelCase";
import ifce_logo_horizontal_branco from "@/app/elementos/assets/img/ifce_logo_horizontal_branco.png";
import { Logout } from "@/app/elementos/basicos/Logout";
import Link from "next/link";

// Menu items.
const items = linksDaSidebarPorTipoDeUsuario["STUDENT"];

export async function SidebarEstudante() {
  const validado = await validarTokenDosCookies();

  const informacoesDeEstudante = await buscarEstudante(validado.sub);

  const informacoesDoCampus = await buscarCampus(
    String(informacoesDeEstudante.campus_id),
  );

  return (
    <Sidebar>
      <SidebarContent className="relative flex-col gap-y-6 border-none bg-verde-400 px-2 py-4 text-branco-400 outline-none">
        <SidebarGroup>
          <Image
            src={ifce_logo_horizontal_branco}
            alt="Logo"
            width={200}
            height={200}
          />
          <p className="font-bold">
            Sisref &nbsp;|&nbsp;
            <span className="font-normal">
              {stringParaCamelCase(informacoesDoCampus.description)}
            </span>
          </p>
        </SidebarGroup>
        <SidebarGroup>
          <div className="flex justify-between gap-x-8">
            <p className="flex place-items-center gap-x-2">
              <Icone.Usuario />
              {stringParaCamelCase(informacoesDeEstudante.name)}
            </p>
            <Logout />
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg text-branco-400">
            Sisref - IFCE {informacoesDoCampus.description}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.isDropdown ? null : (
                  <SidebarMenuItem key={item.titulo}>
                    <SidebarMenuButton asChild>
                      <Link href={item.rota}>
                        {React.createElement(Icone[item.icone] as any)}
                        <span>{item.titulo}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarEstudanteBotaoFechar />
      </SidebarContent>
    </Sidebar>
  );
}

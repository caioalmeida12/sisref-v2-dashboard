import { buscarCampus } from "@/app/actions/campus";
import { buscarEstudante } from "@/app/actions/estudante";
import ifce_logo_horizontal_branco from "@/app/elementos/assets/img/ifce_logo_horizontal_branco.png";
import Icone from "@/app/elementos/basicos/Icone";
import { Logout } from "@/app/elementos/basicos/Logout";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/elementos/shadcn/components/ui/sidebar";
import { linksDaSidebarPorTipoDeUsuario } from "@/app/lib/elementos/LinksDaSidebarPorTipoDeUsuario";
import { stringParaCamelCase } from "@/app/lib/elementos/StringParaCamelCase";
import Image from "next/image";
import { SidebarEstudanteBotaoFechar } from "./SidebarEstudanteBotaoFechar";
import SidebarEstudanteLink from "./SidebarEstudanteLink";

// Menu items.
const items = linksDaSidebarPorTipoDeUsuario["STUDENT"];

export async function SidebarEstudante() {
  const informacoesDeEstudante = await buscarEstudante();

  const informacoesDoCampus = await buscarCampus(
    String(informacoesDeEstudante.campus_id),
  );

  return (
    <Sidebar>
      <SidebarContent className="relative flex-col gap-y-4 border-none bg-preto-300 px-4 py-4 text-branco-400 outline-hidden">
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
            <p className="inline-flex place-items-center items-start gap-x-2">
              <span className="mt-1">
                <Icone.Usuario />
              </span>
              <span className="leading-tight">
                {stringParaCamelCase(informacoesDeEstudante.name)}
              </span>
            </p>
            <Logout />
          </div>
        </SidebarGroup>
        <SidebarGroup className="rounded bg-verde-400">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.isDropdown ? null : (
                  <SidebarMenuItem key={item.titulo}>
                    <SidebarMenuButton asChild>
                      <SidebarEstudanteLink item={item} />
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

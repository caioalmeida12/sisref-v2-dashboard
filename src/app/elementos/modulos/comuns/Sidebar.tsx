import React from "react";
import ifce_logo_horizontal_branco from "@/app/elementos/assets/img/ifce_logo_horizontal_branco.png";
import Image from "next/image";
import Icone from "@elementos/basicos/Icone";
import { stringParaCamelCase } from "@/app/lib/elementos/StringParaCamelCase";
import { linksDaSidebarPorTipoDeUsuario } from "@/app/lib/elementos/LinksDaSidebarPorTipoDeUsuario";
import { cookies } from "next/headers";
import { IInformacoesDeLogin } from "@/app/lib/middlewares/IInformacoesDeLogin";
import { Logout } from "@elementos/basicos/Logout";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { buscarCampus } from "@/app/actions/campus";
import { HorarioNoServidorSidebarAdministrativa } from "./HorarioNoServidorSidebarAdministrativa";

// export const Sidebar = async ({ token_decodificado }: { token_decodificado: ITokenDecodificado }) => {
export const Sidebar = async () => {
  // A Api não possui uma rota para buscar informações de outros tipos de usuário senão estudantes, então vou mockar o retorno
  const usuario = {
    campus_id: 1,
    name: "Usuário Mockado",
  };

  const campus = await buscarCampus(String(usuario.campus_id));

  const tipo_de_usuario = (await cookies()).get("classification")
    ?.value as IInformacoesDeLogin["classification"];

  const links = linksDaSidebarPorTipoDeUsuario[tipo_de_usuario];

  return (
    <div className="flex h-screen flex-col gap-y-6 bg-preto-300 px-6 py-4 text-branco-400">
      <div>
        <Image
          src={ifce_logo_horizontal_branco}
          alt="Logo"
          width={200}
          height={200}
        />
        <p className="font-bold">
          Sisref &nbsp;|&nbsp;
          <span className="font-normal">
            {stringParaCamelCase(campus.description)}
          </span>
        </p>
      </div>
      <div className="flex justify-between gap-x-8">
        <p className="flex place-items-center gap-x-2">
          <Icone.Usuario />
          {stringParaCamelCase(usuario.name)}
        </p>
        <Logout />
      </div>
      <NavigationMenu.Root className="flex flex-col gap-y-4 rounded bg-verde-400 p-4">
        {links.map((link, index) =>
          link.isDropdown ? (
            <NavigationMenu.Item
              key={index}
              className="relative flex cursor-pointer items-center gap-x-2"
            >
              <NavigationMenu.Trigger className="group flex items-center gap-2">
                {link.titulo}
                <Icone.Dropdown />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute inset-x-0 top-full mt-1 flex flex-col gap-y-2 rounded bg-branco-400 p-4 py-3 shadow-sm shadow-preto-400">
                {link.itens.map((item, itemIndex) => (
                  <Link
                    replace
                    className="text-verde-400 underline-offset-[.25em] hover:underline"
                    key={itemIndex}
                    href={item.rota}
                  >
                    {item.titulo}
                  </Link>
                ))}
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <Link
              replace
              className='relative flex min-w-max cursor-pointer items-center gap-x-2 before:inset-[-.5em] before:hidden before:rounded before:bg-branco-400 before:opacity-10 before:content-[""] hover:before:absolute hover:before:block'
              key={index}
              href={link.rota}
            >
              {React.createElement(Icone[link.icone] as any)}
              {link.titulo}
            </Link>
          ),
        )}
      </NavigationMenu.Root>
      <div className="mt-auto">
        <HorarioNoServidorSidebarAdministrativa />
      </div>
    </div>
  );
};

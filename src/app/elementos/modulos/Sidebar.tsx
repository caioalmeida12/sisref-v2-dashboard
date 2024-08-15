import React from "react"
import ifce_logo_horizontal_branco from '@/app/elementos/assets/img/ifce_logo_horizontal_branco.png';
import Image from "next/image"
import { ITokenDecodificado } from "@/app/lib/middlewares/ITokenDecodificado";
import { fetchInformacoesDoCampus } from "@/app/actions/fetchInformacoesDoCampus";
import Icone from "../basicos/Icone";
import { stringParaCamelCase } from "@/app/lib/elementos/StringParaCamelCase";
import { linksDaSidebarPorTipoDeUsuario } from "@/app/lib/elementos/LinksDaSidebarPorTipoDeUsuario";
import { cookies } from "next/headers";
import { IInformacoesDeLogin } from "@/app/lib/middlewares/IInformacoesDeLogin";
import { Logout } from "../basicos/Logout";
import Link from "next/link";
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

export const Sidebar = async ({ token_decodificado }: { token_decodificado: ITokenDecodificado }) => {
    // A Api não possui uma rota para buscar informações de outros tipos de usuário senão estudantes, então vou mockar o retorno
    const usuario = {
        campus_id: 1,
        name: "Usuário Mockado",
    }

    const campus = await fetchInformacoesDoCampus(String(usuario.campus_id))

    const tipo_de_usuario = cookies().get("classification")?.value as IInformacoesDeLogin["classification"]

    const links = linksDaSidebarPorTipoDeUsuario[tipo_de_usuario]

    return (
        <div className="flex flex-col gap-y-6 bg-preto-300 text-branco-400 px-6 py-4 w-fit h-[100vh]">
            <div>
                <Image src={ifce_logo_horizontal_branco} alt="Logo" width={200} height={200} />
                <p className="font-bold">Sisref &nbsp;|&nbsp;
                    <span className="font-normal">{
                        stringParaCamelCase(campus.description)
                    }</span>
                </p>
            </div>
            <div className="flex justify-between gap-x-8">
                <p className="flex gap-x-2 place-items-center"><Icone.Usuario />
                    {
                        stringParaCamelCase(usuario.name)
                    }
                </p>
                <Logout />
            </div>
            <NavigationMenu.Root className="bg-verde-400 p-4 rounded flex flex-col gap-y-4">
                {
                    links.map((link, index) => (
                        link.isDropdown ? (
                            <NavigationMenu.Item key={index} className="relative flex items-center gap-x-2 cursor-pointer">
                                <NavigationMenu.Trigger className='flex items-center gap-2 group'>
                                    {link.titulo}
                                    <Icone.Dropdown />
                                </NavigationMenu.Trigger>
                                <NavigationMenu.Content className='absolute top-full inset-x-0 bg-branco-400 p-4 py-3 rounded shadow-preto-400 shadow-sm flex flex-col gap-y-2 mt-1'>
                                    {link.itens.map((item, itemIndex) => (
                                        <Link className='hover:underline underline-offset-[.25em] text-verde-400' key={itemIndex} href={item.rota}>{item.titulo}</Link>
                                    ))}
                                </NavigationMenu.Content>
                            </NavigationMenu.Item>
                        ) : (
                            <Link className='flex gap-x-2 items-center cursor-pointer relative before:content-[""] before:inset-[-.5em] before:rounded before:opacity-10 before:bg-branco-400 before:hidden hover:before:block hover:before:absolute' key={index} href={link.rota}>
                                {React.createElement(Icone[link.icone] as any)}
                                {link.titulo}
                            </Link>
                        )
                    ))
                }
            </NavigationMenu.Root>
        </div >
    )
}
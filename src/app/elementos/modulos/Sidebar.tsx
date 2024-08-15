import React from "react"
import ifce_logo_horizontal_branco from '@/app/elementos/assets/img/ifce_logo_horizontal_branco.png';
import Image from "next/image"
import { ITokenDecodificado } from "@/app/lib/middlewares/ITokenDecodificado";
import { fetchInformacoesDeEstudante } from "@/app/lib/middlewares/FetchInformacoesDeEstudante";
import { fetchInformacoesDoCampus } from "@/app/actions/fetchInformacoesDoCampus";
import Icone from "../basicos/Icone";
import { stringParaCamelCase } from "@/app/lib/elementos/StringParaCamelCase";
import { linksDaSidebarPorTipoDeUsuario } from "@/app/lib/elementos/LinksDaSidebarPorTipoDeUsuario";
import { cookies } from "next/headers";
import { IInformacoesDeLogin } from "@/app/lib/middlewares/IInformacoesDeLogin";
import { Logout } from "../basicos/Logout";

export const Sidebar = async ({ token_decodificado }: { token_decodificado: ITokenDecodificado }) => {
    const usuario = await fetchInformacoesDeEstudante(token_decodificado.sub)
    const campus = await fetchInformacoesDoCampus(String(usuario.campus_id))

    const tipo_de_usuario = cookies().get("classification")?.value as IInformacoesDeLogin["classification"]

    const links = linksDaSidebarPorTipoDeUsuario["ASSIS_ESTU"]

    return (
        <div className="flex flex-col gap-y-6 bg-preto-300 text-branco-400 p-4 w-fit h-full">
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
            <div className="bg-verde-400 p-3 rounded flex flex-col gap-y-4">
                {
                    links.map((link, index) => (
                        link.isDropdown ? (
                            <div key={index}>
                                <p>{link.titulo}</p>
                                <div>
                                    {
                                        link.itens.map((item, index) => (
                                            <p key={index}>{item.titulo}</p>
                                        ))
                                    }
                                </div>
                            </div>
                        ) : (
                            <p className="flex gap-x-2 items-center" key={index}>
                                {React.createElement(Icone[link.icone] as any)}
                                {link.titulo}
                            </p>
                        )
                    ))
                }
            </div>
        </div>
    )
}
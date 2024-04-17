"use client"

import { IconeMenu } from "@elementos/basicos/icones/IconeMenu";
import { INavbarProps } from "../interfaces/INavbarProps";
import { useState } from "react";
import { IconeFechar } from "@elementos/basicos/icones/IconeFechar";
import { MenuDropdown } from "./MenuDropdown";
import { MenuNavItem } from "./MenuNavItem";

export const MenuDrawer = ({ navItems }: INavbarProps) => {
    const [aberto, setAberto] = useState(false);

    const IconeFecharSeAberto = aberto && (
        <div className="flex justify-end px-6 py-4">
            <IconeFechar onClick={() => setAberto(false)} />
        </div>
    )

    const ConteudoSeAberto = aberto && (
        <div className={`flex flex-col gap-y-4 px-4 transition-all 
                         ${aberto? "opacity-100" : "opacity-0"}
                         md:px-[3em]
                        `}>
            {
                navItems.map((navItem, index) => (
                    <li key={index} className="flex items-center gap-x-2 cursor-pointer">
                        {navItem.isDropdown ? (
                            <MenuDropdown titulo={navItem.titulo} itens={navItem.itens} isDropdown={true} />
                        ) : (
                            <MenuNavItem titulo={navItem.titulo} rota={navItem.rota} />
                        )}
                    </li>
                ))
            }
        </div>
    )

    return (
        <>
            <IconeMenu onClick={() => setAberto(true)} />
            <div
                className={`
                        flex flex-col gap-y-4 fixed z-20 bg-verde-400 transition-all
                        w-0 h-full top-0 left-0
                        ${aberto ? "w-60 lg:w-80" : "w-0"}
                        `}>
                {IconeFecharSeAberto}
                {ConteudoSeAberto}
            </div>
        </>
    );
}

"use client"

import { INavItemSemDropdown } from "../interfaces/INavbarProps";

export const MenuNavItem = ({ titulo, rota }: INavItemSemDropdown) => {
    const createHandleMenuClick = (menuItem: string) => {
        return () => {
            console.log(`Clicked on ${menuItem}`);
        };
    }

    return (
        <a className="flex items-center gap-x-2 cursor-pointer" onClick={createHandleMenuClick(titulo)}>
            {titulo}
        </a>
    );
}
import React from 'react';
import { INavbarProps } from '../interfaces/INavbarProps';
import { MenuDropdown } from '../componentes/MenuDropdown';
import { MenuNavItem } from '../componentes/MenuNavItem';
import { MenuDrawer } from '../componentes/MenuDrawer';
import { Logout } from '../basicos/Logout';

export const Navbar = ({ navItems }: INavbarProps) => {
    return (
        <nav className="bg-verde-400 dark:bg-darkMode-plano text-branco-400 dark:text-darkMode-textoPrimario dark:border-b border-cinza-400 font-medium justify-between px-6 py-4 sticky top-0 right-0 left-0 flex items-center z-10
                        md:px-[3em]">
            <MenuDrawer navItems={navItems} />
            <ul className="hidden justify-between gap-x-8 md:flex">
                {navItems.map((navItem, index) => (
                    <li key={index} className="flex items-center gap-x-2 cursor-pointer">
                        {navItem.isDropdown ? (
                            <MenuDropdown titulo={navItem.titulo} itens={navItem.itens} isDropdown={true} />
                        ) : (
                            <MenuNavItem titulo={navItem.titulo} rota={navItem.rota} />
                        )}
                    </li>
                ))}
            </ul>
            <Logout />
        </nav>
    );
}
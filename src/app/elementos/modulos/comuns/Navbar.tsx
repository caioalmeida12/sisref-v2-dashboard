"use client"

import React from 'react';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { INavbarProps } from '@/app/interfaces/INavbarProps';
import Link from 'next/link';
import { Logout } from '@elementos/basicos/Logout';
import { MenuDrawer } from '@elementos/componentes/MenuDrawer';
import Icone from '@elementos/basicos/Icone';

export const Navbar = ({ navItems }: INavbarProps) => {
    return (
        <NavigationMenu.Root className="bg-verde-400 text-branco-400 font-medium sticky top-0 z-10">
            <div className='max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4'>
                <MenuDrawer navItems={navItems} />
                <NavigationMenu.List className="hidden gap-x-8 gap-y-2 md:flex justify-center flex-wrap">
                    <NavbarNavigation navItems={navItems} />
                </NavigationMenu.List>
                <Logout />
            </div>
        </NavigationMenu.Root>
    );
};

export const NavbarNavigation = ({ navItems }: INavbarProps) => {
    return (
        navItems.map((navItem, index) => (
            navItem.isDropdown ? (
                <NavigationMenu.Item key={index} className="relative flex items-center gap-x-2 cursor-pointer">
                    <NavigationMenu.Trigger className='flex items-center gap-2 group'>
                        {navItem.titulo}
                        <Icone.Dropdown />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className='absolute top-full inset-x-0 bg-branco-400 p-4 py-3 rounded shadow-preto-400 shadow-sm flex flex-col gap-y-2 mt-1'>
                        {navItem.itens.map((item, itemIndex) => (
                            <Link className='hover:underline underline-offset-[.25em] text-verde-400' key={itemIndex} href={item.rota}>{item.titulo}</Link>
                        ))}
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            ) : (
                <NavigationMenu.Item key={index} className="flex items-center gap-x-2 cursor-pointer">
                    <Link className='hover:underline underline-offset-[.25em] ' href={navItem.rota}>{navItem.titulo}</Link>
                </NavigationMenu.Item>
            )
        ))
    )
}


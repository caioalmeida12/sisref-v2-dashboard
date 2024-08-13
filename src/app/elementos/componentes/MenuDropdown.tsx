"use client"

import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { INavItemComDropdown } from '../interfaces/INavbarProps';
import Icone from '../basicos/icones';

export const MenuDropdown = ({ titulo, itens }: INavItemComDropdown) => {
    const createHandleMenuClick = (menuItem: string) => {
        return () => {
            console.log(`Clicked on ${menuItem}`);
        };
    };

    return (
        <div className="cursor-pointer">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex gap-x-2 items-center">{titulo}<Icone.Dropdown /></DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-verde-400 rounded z-20 p-4 py-2 font-medium text-branco-400">
                        {
                            itens.map((item, index) => (
                                <DropdownMenu.Item key={index} onSelect={createHandleMenuClick(item.titulo)}>{item.titulo}</DropdownMenu.Item>
                            ))
                        }
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
};
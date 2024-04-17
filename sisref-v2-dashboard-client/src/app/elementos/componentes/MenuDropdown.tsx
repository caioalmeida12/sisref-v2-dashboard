"use client"

import { Dropdown, Menu as BaseMenu, MenuButton, MenuItem } from '@mui/base';
import { IconeDropdown } from '@elementos/basicos/icones/IconeDropdown'
import { INavItemComDropdown } from '../interfaces/INavbarProps';

export const MenuDropdown = ({ titulo, itens }: INavItemComDropdown) => {
    const createHandleMenuClick = (menuItem: string) => {
        return () => {
            console.log(`Clicked on ${menuItem}`);
        };
    };

    return (
        <div className="cursor-pointer">
            <Dropdown>
                <MenuButton className="flex gap-x-2 items-center">{titulo}<IconeDropdown /></MenuButton>
                <BaseMenu className="bg-verde-400 rounded z-20 p-4 py-2 font-medium text-branco-400">
                    {
                        itens.map((item, index) => (
                            <MenuItem key={index} onClick={createHandleMenuClick(item.titulo)}>{item.titulo}</MenuItem>
                        ))
                    }
                </BaseMenu>
            </Dropdown>
        </div>
    )
}
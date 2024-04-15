export type INavItemSemDropdown = {
    titulo: string;
    rota: string;
    isDropdown?: false;
}

export type INavItemComDropdown = {
    titulo: string;
    isDropdown: true;
    itens: {
        titulo: string;
        rota: string;
    }[];
}

export type INavItem = INavItemSemDropdown | INavItemComDropdown;

export type INavbarProps = {
    navItems: INavItem[];
}
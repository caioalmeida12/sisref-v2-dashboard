import { IconeLogout } from "../basicos/icones/IconeLogout";
import { IconeMenu } from "../basicos/icones/IconeMenu";

type NavItem = {
    titulo: string;
    rota: string;
    isDropdown: false;
} | {
    titulo: string;
    isDropdown: true;
    itens: {
        titulo: string;
        rota: string;
    }[];
}

type NavbarProps = {
    navItems: NavItem[];
}

export const Navbar = ({ navItems }: NavbarProps) => {
    return (
        <nav className="bg-verde-400 text-branco-400 font-bold justify-between px-6 py-4 sticky top-0 right-0 left-0 flex items-center z-10">
            <IconeMenu />
            <ul className="hidden justify-stretch">
                {navItems.map((navItem, index) => (
                    <li key={index} className="p-4">{navItem.titulo}</li>
                ))}
            </ul>
            <IconeLogout />
        </nav>
    );
}
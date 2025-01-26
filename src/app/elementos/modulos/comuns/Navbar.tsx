"use client";

import React from "react";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { INavbarProps } from "@/app/interfaces/INavbarProps";
import Link from "next/link";
import { Logout } from "@elementos/basicos/Logout";
import Icone from "@elementos/basicos/Icone";
import { useSidebar } from "../../shadcn/components/ui/sidebar";

export const Navbar = ({ navItems }: INavbarProps) => {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <NavigationMenu.Root className="sticky top-0 z-10 bg-verde-400 font-medium text-branco-400">
      <div className="mx-auto flex max-w-(--breakpoint-xl) items-center justify-between px-6 py-4">
        <Icone.Menu onClick={toggleSidebar} />
        {isMobile ? (
          <NavigationMenu.List className="hidden flex-wrap justify-center gap-x-8 gap-y-2 md:flex">
            <NavbarNavigation navItems={navItems} />
          </NavigationMenu.List>
        ) : null}
        <Logout />
      </div>
    </NavigationMenu.Root>
  );
};

export const NavbarNavigation = ({ navItems }: INavbarProps) => {
  return navItems.map((navItem, index) =>
    navItem.isDropdown ? (
      <NavigationMenu.Item
        key={index}
        className="relative flex cursor-pointer items-center gap-x-2"
      >
        <NavigationMenu.Trigger className="group flex items-center gap-2">
          {navItem.titulo}
          <Icone.Dropdown />
        </NavigationMenu.Trigger>
        <NavigationMenu.Content className="absolute inset-x-0 top-full mt-1 flex flex-col gap-y-2 rounded bg-branco-400 p-4 py-3 shadow-xs shadow-preto-400">
          {navItem.itens.map((item, itemIndex) => (
            <Link
              className="text-verde-400 underline-offset-[.25em] hover:underline"
              key={itemIndex}
              href={item.rota}
            >
              {item.titulo}
            </Link>
          ))}
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    ) : (
      <NavigationMenu.Item
        key={index}
        className="flex cursor-pointer items-center gap-x-2"
      >
        <Link
          className="underline-offset-[.25em] hover:underline"
          href={navItem.rota}
        >
          {navItem.titulo}
        </Link>
      </NavigationMenu.Item>
    ),
  );
};

"use client";

import React from "react";

import { Footer } from "@/app/elementos/componentes/Footer";
import { Login } from "@/app/elementos/modulos/comuns/Login";
import { Navbar } from "@/app/elementos/modulos/comuns/Navbar";
import { SidebarProvider } from "@/app/elementos/shadcn/components/ui/sidebar";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider className="contents">
        <Navbar navItems={[]} />
        <main className="flex grow items-center justify-center bg-branco-400 p-4">
          <Login />
        </main>
      </SidebarProvider>
      <Footer />
    </div>
  );
}

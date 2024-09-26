"use client";

import React from "react";

import { Footer } from "@/app/elementos/componentes/Footer";
import { Login } from "@/app/elementos/modulos/comuns/Login";
import { Navbar } from "@/app/elementos/modulos/comuns/Navbar";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar navItems={[]} />
      <main className="flex flex-grow items-center justify-center bg-branco-400 p-4">
        <Login />
      </main>
      <Footer />
    </div>
  );
}

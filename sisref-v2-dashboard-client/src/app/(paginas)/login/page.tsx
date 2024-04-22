import React from 'react'

import { Footer } from "@/app/elementos/componentes/Footer"
import { Login } from "@/app/elementos/modulos/Login"
import { Navbar } from "@/app/elementos/modulos/Navbar"

export default function LoginPage() {
    return (
        <>
            <Navbar navItems={[]} />
            <main className="p-4 bg-branco-400">
                <Login />
            </main>
            <Footer />
        </>
    )
}
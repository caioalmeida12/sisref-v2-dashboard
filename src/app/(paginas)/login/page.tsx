"use client"

import React from 'react'

import { Footer } from "@/app/elementos/componentes/Footer"
import { Login } from "@/app/elementos/modulos/comuns/Login"
import { Navbar } from "@/app/elementos/modulos/comuns/Navbar"

export default function LoginPage() {
    return (

        <div className='flex flex-col min-h-screen'>
            <Navbar navItems={[]} />
            <main className="flex-grow p-4 bg-branco-400 flex items-center justify-center">
                <Login />
            </main>
            <Footer />
        </div>

    )
}
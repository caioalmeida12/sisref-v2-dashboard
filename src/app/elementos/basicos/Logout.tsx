"use client"

import React from "react"
import Icone from "./Icone"
import { logout } from "@/app/actions/comuns"

export const Logout = () => {
    const handleLogout = async () => await logout()

    return <button name="Sair" onClick={handleLogout} className='relative before:content-[""] before:inset-[-.5em] before:rounded before:opacity-10 before:bg-branco-400 hover:before:absolute'>
        <Icone.Logout />
    </button>
}
"use client"

import { logout } from "@/app/actions/Logout"
import { IconeLogout } from "./icones/IconeLogout"
import React from "react"

export const Logout = () => {
    const handleLogout = async () => await logout()

    return <button name="Sair" onClick={handleLogout} className='relative before:content-[""] before:inset-[-.5em] before:rounded before:opacity-10 before:bg-branco-400 hover:before:absolute'>
        <IconeLogout />
    </button>
}
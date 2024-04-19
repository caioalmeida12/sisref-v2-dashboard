"use client"

import { logout } from "@/app/actions/Logout"
import { IconeLogout } from "./icones/IconeLogout"
import React from "react"

export const Logout = () => {
    const handleLogout = async () => await logout()

    return <button onClick={handleLogout}>
        <IconeLogout />
    </button>
}
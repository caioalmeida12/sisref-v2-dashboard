"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    cookies().getAll().forEach(cookie => {
        cookies().delete(cookie.name)
    })

    redirect(process.env.URL_BASE + "/login")
}
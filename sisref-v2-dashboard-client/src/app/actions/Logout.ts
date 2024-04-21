"use server"

import { cookies } from "next/headers";
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction";


export async function logout() {
    cookies().getAll().forEach(cookie => {
        cookies().delete(cookie.name)
    })

    return redirecionarViaAction()
}
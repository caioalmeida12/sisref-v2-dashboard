import { NextResponse } from "next/server"

export const redirecionarParaLogin = (base?: string) => {
    if (!base) base = process.env.URL_BASE

    return NextResponse.redirect(base + "/login")
}
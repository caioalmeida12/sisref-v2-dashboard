import { NextResponse } from "next/server"

export const redirecionarParaLogin = (base: string) => {
    return NextResponse.rewrite(new URL('/login', base))
}
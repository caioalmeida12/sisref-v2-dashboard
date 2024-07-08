import { NextResponse, NextRequest } from "next/server";
import { validarTokenDosCookies } from "./ValidarTokenDosCookies";
import { redirecionarViaMiddleware } from "./RedirecionarViaMiddleware";


/**
 * Armazena as rotas que não requerem autenticação
 * @example ex: ["/login", "/logout"]
 */
const rotasQueNaoRequeremAutenticacao: string[] = [
    "/login",
    "/logout"
]


export const requerAutenticacaoMiddleware = async (req: NextRequest) => {
    const pathname = new URL(req.url).pathname
    if (rotasQueNaoRequeremAutenticacao.includes(pathname)) return NextResponse.next();

    const validado = validarTokenDosCookies()

    try {
        const fetchAuth = await fetch(`https://ruapi.cedro.ifce.edu.br/api/all/show-student/${validado.sub}`);
        if (!fetchAuth.ok) redirecionarViaMiddleware("/login")
    } catch (error) {
        console.log("Erro ao buscar informações do estudante (middleware.ts): ")
        console.error(error)
    }

    return NextResponse.next()
}
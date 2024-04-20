import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { redirecionarParaLogin } from "./RedirecionarParaLogin";
import { ITokenDecodificado } from "./ITokenDecodificado";
import { validarTokenDosCookies } from "./ValidarTokenDosCookies";

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
    if (!validado) return redirecionarParaLogin();

    try {
        const fetchAuth = await fetch(`https://ruapi.cedro.ifce.edu.br/api/all/show-student/${validado.sub}`);
        if (!fetchAuth.ok) redirecionarParaLogin();
    } catch (error) {
        console.log("Erro ao buscar informações do estudante (middleware.ts): ")
        console.error(error)
    }

    return NextResponse.next()
}
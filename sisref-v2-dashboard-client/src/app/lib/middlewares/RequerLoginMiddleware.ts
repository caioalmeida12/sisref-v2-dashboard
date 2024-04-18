import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface ITokenDecodificado {
    iss: string;
    iat: number;
    exp: number;
    nbf: number;
    jti: string;
    sub: string;
    prv: string;
    role: string;
    name: string;
}

export const redirecionarParaLogin = (base: string) => {
    return NextResponse.redirect(new URL('/login', base))
}

/**
 * Armazena as rotas que não requerem login
 * ex: ["/login", "/logout"]
 */
const rotasQueNaoRequeremLogin: string[] = [
    "/login",
    "/logout"
]

export const requerLoginMiddleware = async (req: NextRequest) => {
    if (!Boolean(process.env.AUTENTICACAO_ATIVA)) return NextResponse.next();

    const pathname = new URL(req.url).pathname
    if (rotasQueNaoRequeremLogin.includes(pathname)) return NextResponse.next();

    const bearer = cookies().get("authorization")

    if (!bearer) return redirecionarParaLogin(req.url)

    const token = bearer.value.split(" ")[1]

    const decodificado = jwt.decode(token) as Partial<ITokenDecodificado>

    if (!decodificado) return redirecionarParaLogin(req.url)
    if (!decodificado.sub) return redirecionarParaLogin(req.url)
    if (!decodificado.exp) return redirecionarParaLogin(req.url)

    if (decodificado.exp * 1000 < Date.now()) return redirecionarParaLogin(req.url)

    try {
        const fetchAuth = await fetch(`https://ruapi.cedro.ifce.edu.br/api/all/show-student/${Number(decodificado.sub)}`);
        if (!fetchAuth.ok) redirecionarParaLogin(req.url);
    } catch (error) {
        console.log("Erro ao buscar informações do estudante (middleware.ts): ")
        console.error(error)
    }

    return NextResponse.next();
}
import { NextResponse, NextRequest } from "next/server";
import { validarTokenDosCookies } from "./ValidarTokenDosCookies";
import { fetchInformacoesDeEstudante } from "./FetchInformacoesDeEstudante";
import { cookies } from "next/headers";
import { redirecionarViaMiddleware } from "./RedirecionarViaMiddleware";
import { IInformacoesDeLogin } from "./IInformacoesDeLogin";


/**
 * Armazena as rotas que não requerem autenticação
 * @example ex: ["/login", "/logout"]
 */
const rotasQueNaoRequeremAutenticacao: string[] = [
    "/login",
    "/logout"
]

interface IRotasEAutorizacoes {
    /**
     * Classificação do usuário
     * ex: "STUDENT"
     */
    classification: IInformacoesDeLogin["classification"],
    /**
     * Rotas permitidas para essa classificação
     * ex: ["/", "/login", "/logout"]
     */
    permissions: string[]
}

const rotasPermitidasPorClassification: IRotasEAutorizacoes[] = [
    {
        classification: "STUDENT",
        permissions: ["/", "/login", "/logout"]
    }, {
        classification: "NUTRI",
        permissions: ["/nutricionista", "/login", "/logout"]
    }, {
        classification: "RECEPCAO",
        permissions: ["/recepcao", "/login", "/logout"]
    }, {
        classification: "ASSIS_ESTU",
        permissions: ["/assistencia_estudantil", "/login", "/logout"]
    }, {
        classification: "ADMIN",
        permissions: ["/administrador", "/login", "/logout"]
    }
]

export const requerAutorizacaoMiddleware = async (req: NextRequest) => {
    const pathname = new URL(req.url).pathname
    if (rotasQueNaoRequeremAutenticacao.includes(pathname)) return NextResponse.next();

    const validado = validarTokenDosCookies()
    // Se a verificação do token falhar, redireciona para a página de login
    if (!validado.sub) return redirecionarViaMiddleware()

    const classification = cookies().get("classification")?.value

    const rotasPermitidas = rotasPermitidasPorClassification.find((r) => r.classification === classification)?.permissions.includes(pathname)
    if (!rotasPermitidas) return redirecionarViaMiddleware()

    try {
        if (classification === "STUDENT") {
            const fetchAuth = await fetchInformacoesDeEstudante(validado.sub);
            if (!fetchAuth) return redirecionarViaMiddleware()
        }

    } catch (error) {
        console.log("Erro ao buscar informações do estudante (middleware.ts): ")
        console.error(error)
    }

    return NextResponse.next()
}
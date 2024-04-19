import { NextResponse, NextRequest } from "next/server";
import { redirecionarParaLogin } from "./RedirecionarParaLogin";
import { validarTokenDosCookies } from "./ValidarTokenDosCookies";
import { fetchInformacoesPessoais } from "./FetchInformacoesPessoais";
import { cookies } from "next/headers";

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
    classification: "STUDENT" | "ASSIS_ESTU" | "RECEPCAO" | "NUTRI",
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
        permissions: ["/", "/login", "/logout"]
    }, {
        classification: "RECEPCAO",
        permissions: ["/", "/login", "/logout"]
    }, {
        classification: "ASSIS_ESTU",
        permissions: ["/", "/login", "/logout"]
    }
]

export const requerAutorizacaoMiddleware = async (req: NextRequest) => {
    if (!Boolean(process.env.AUTENTICACAO_ATIVA)) return NextResponse.next();

    const pathname = new URL(req.url).pathname
    if (rotasQueNaoRequeremAutenticacao.includes(pathname)) return NextResponse.next();

    const validado = validarTokenDosCookies()
    if (!validado) return redirecionarParaLogin(req.url);

    const classification = cookies().get("classification")?.value
    if (!classification) return redirecionarParaLogin(req.url);

    const rotasPermitidas = rotasPermitidasPorClassification.find((r) => r.classification === classification)?.permissions.includes(pathname)
    if (!rotasPermitidas) return redirecionarParaLogin(req.url);

    try {
        if (classification === "STUDENT") {
            const fetchAuth = await fetchInformacoesPessoais(Number(validado.sub));
            if (!fetchAuth) return redirecionarParaLogin(req.url);
        }

    } catch (error) {
        console.log("Erro ao buscar informações do estudante (middleware.ts): ")
        console.error(error)
    }

    return NextResponse.next()
}
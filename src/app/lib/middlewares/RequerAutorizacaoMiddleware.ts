import { NextResponse, NextRequest } from "next/server";
import { validarTokenDosCookies } from "./ValidarTokenDosCookies";
import { cookies } from "next/headers";
import { redirecionarViaMiddleware } from "./RedirecionarViaMiddleware";
import { IInformacoesDeLogin } from "./IInformacoesDeLogin";
import { buscarEstudante } from "@/app/actions/estudante";


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

const rotasPermitidasPorTipoDeUsuario: IRotasEAutorizacoes[] = [
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

    const tipoDeUsuario = cookies().get("classification")?.value

    // Se não houver classificação, redireciona para a página de login
    if (!tipoDeUsuario) return redirecionarViaMiddleware()

    // Se a rota não for permitida para o tipo de usuário, redireciona para a primeira rota permitida
    const rotasPermitidas = rotasPermitidasPorTipoDeUsuario.find(item => item.classification === tipoDeUsuario)?.permissions
    if (!rotasPermitidas?.includes(pathname)) return redirecionarViaMiddleware(rotasPermitidas?.at(0))

    if (tipoDeUsuario === "STUDENT") {
        const dadosDeEstudante = await buscarEstudante(validado.sub);
        if (!dadosDeEstudante) return redirecionarViaMiddleware()
    }

    return NextResponse.next()
}
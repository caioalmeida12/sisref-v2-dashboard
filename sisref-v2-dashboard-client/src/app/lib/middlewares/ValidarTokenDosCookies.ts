import { cookies } from "next/headers";
import { ITokenDecodificado } from "./ITokenDecodificado";
import jwt from "jsonwebtoken";
import { redirecionarViaMiddleware } from "./RedirecionarViaMiddleware";

/**
 * Valida o token do usuário a partir do cookie de autorização
 * @returns ITokenDecodificado
 */
export const validarTokenDosCookies = (): ITokenDecodificado => {
    const bearer = cookies().get("authorization");
    if (!bearer) return redirecionarViaMiddleware()

    const token = bearer.value.split(" ")[1];
    const decodificado = jwt.decode(token) as Partial<ITokenDecodificado>;

    if (!decodificado) return redirecionarViaMiddleware()
    if (typeof decodificado.sub === "undefined") return redirecionarViaMiddleware()

    if (typeof decodificado.exp === "undefined") return redirecionarViaMiddleware()
    if (Date.now() >= decodificado.exp * 1000) return redirecionarViaMiddleware()
    
    return decodificado as ITokenDecodificado;
}
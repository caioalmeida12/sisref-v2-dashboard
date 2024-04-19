import { cookies } from "next/headers";
import { ITokenDecodificado } from "./ITokenDecodificado";
import jwt from "jsonwebtoken";

/**
 * Valida o token do usuário a partir do cookie de autorização
 * @returns ITokenDecodificado | null
 */
export const validarTokenDosCookies = () => {
    const bearer = cookies().get("authorization");
    if (!bearer) return null;

    const token = bearer.value.split(" ")[1];
    const decodificado = jwt.decode(token)

    if (!decodificado) return null;
    if (typeof decodificado.sub === "undefined") return null;
    
    return decodificado as ITokenDecodificado;
}
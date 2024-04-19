import { cookies } from "next/headers";
import { ITokenDecodificado } from "./ITokenDecodificado";
import jwt from "jsonwebtoken";

/**
 * Valida o token do usuário a partir do cookie de autorização
 * @returns ITokenDecodificado | false
 */
export const validarTokenDosCookies = () => {
    const bearer = cookies().get("authorization");
    if (!bearer) return false;

    const token = bearer.value.split(" ")[1];
    const decodificado = jwt.decode(token) as Partial<ITokenDecodificado>;

    return decodificado && decodificado.sub && decodificado.exp && decodificado.exp * 1000 >= Date.now() ? decodificado : false;
}
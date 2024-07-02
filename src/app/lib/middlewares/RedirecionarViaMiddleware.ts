import { NextResponse } from "next/server";

/**
 * Redireciona para a URL especificada.
 * 
 * @param destination - A URL para a qual redirecionar. Por padrão é "/login" se não for fornecida.
 * @scope Deve ser usado em Middleware.
 */
export const redirecionarViaMiddleware = (destination = "/login") => {
    return NextResponse.redirect(`${process.env.URL_BASE}${destination}`) as never
}
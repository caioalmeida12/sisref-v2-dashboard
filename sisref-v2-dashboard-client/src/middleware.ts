import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers';

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

const redirecionarParaLogin = (base: string) => {
  return NextResponse.redirect(new URL('/login', base))
}

export default async function middleware(req: NextRequest) {
  if (!Boolean(process.env.AUTENTICACAO_ATIVA)) return NextResponse.next()

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
    if (!fetchAuth.ok) redirecionarParaLogin(req.url)
  } catch (error) {
    console.log("Erro ao buscar informações do estudante (middleware.ts): ")
    console.error(error)
  }
}

// Whitelist de rotas que não devem passar pelo middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|login).*)'],
}
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

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
  const bearer = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3J1YXBpLmNlZHJvLmlmY2UuZWR1LmJyL2FwaS9sb2dpbiIsImlhdCI6MTcxMzM1NzkwMSwiZXhwIjoxNzEzNDY1OTAxLCJuYmYiOjE3MTMzNTc5MDEsImp0aSI6IndFVFF6Q1pjdUtVNjN6azMiLCJzdWIiOiIyODgiLCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIiwicm9sZSI6IiIsIm5hbWUiOiIifQ.LN7hftXiKNJm0I2pLFhM_NhO8-OOyYnYkzEJhnrWt3o"

  const token = bearer.split(' ')[1]

  const decodificado = jwt.decode(token) as Partial<ITokenDecodificado>

  if (!decodificado) return redirecionarParaLogin(req.url)
  if (!decodificado.sub) return redirecionarParaLogin(req.url)
  if (!decodificado.exp) return redirecionarParaLogin(req.url)

  if (decodificado.exp * 1000 < Date.now()) return redirecionarParaLogin(req.url)

  try {
    const fetchAuth = await fetch(`https://ruapi.cedro.ifce.edu.br/api/all/show-student/${Number(decodificado.sub)}`);
    if (!fetchAuth.ok) redirecionarParaLogin(req.url)
  } catch (error) {
    console.error(error)
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
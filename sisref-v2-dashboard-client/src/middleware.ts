import { NextRequest} from 'next/server'
import { requerAutorizacaoMiddleware } from './app/lib/middlewares/RequerAutorizacaoMiddleware';

export default async function middleware(requisicao: NextRequest) {
  let resposta = await requerAutorizacaoMiddleware(requisicao)

  return resposta
}

// Whitelist de rotas que não devem passar pelo middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
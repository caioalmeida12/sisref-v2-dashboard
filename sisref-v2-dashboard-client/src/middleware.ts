import { NextRequest } from 'next/server'
import { requerLoginMiddleware } from './app/lib/middlewares/RequerLoginMiddleware';

export default async function middleware(requisicao: NextRequest) {
  return await requerLoginMiddleware(requisicao);
}

// Whitelist de rotas que não devem passar pelo middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
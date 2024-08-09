import { NextRequest } from 'next/server'
import { requerAutorizacaoMiddleware } from './app/lib/middlewares/RequerAutorizacaoMiddleware';
import { isRedirectError } from 'next/dist/client/components/redirect';

export default async function middleware(requisicao: NextRequest) {
  const resposta = await requerAutorizacaoMiddleware(requisicao).catch((erro) => {
    // Quando a função redirecionarViaMiddleware é chamada, um erro de redirecionamento é lançado. 
    // O next.js trata esse erro e redireciona o usuário para a página de login automaticamente.
    // Se o erro for um erro de redirecionamento, não queremos que ele seja tratado como outro tipo de erro. 
    // Assim, retornamos o erro e deixamos o next lidar com isso.
    if (isRedirectError(erro)) return erro

    throw erro
  })

  return resposta
}

// Whitelist de rotas que não devem passar pelo middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
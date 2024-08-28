import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { mensagemDeErroPorCodigoHTTP } from "./MensagemDeErroPorCodigoHTTP";
import { redirecionarViaAction } from "./RedirecionarViaAction";

type RespostaDaAPI<T> = {
    sucesso: false;
    message: string;
} | {
    sucesso: true;
    resposta: Array<T>;
};

const respostaFoiErroDeAutenticacao = (resposta: unknown) => {
    if (typeof resposta === 'object' && resposta !== null && 'message' in resposta) { return true; }

    return false;
}

export class FetchHelper {
    /**
     * Executa uma requisição GET para a API.
     * 
     * @param url - A URL a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo.
     * @param cookies - Os cookies da requisição. Podem ser obtidos através da função `cookies()` do Next.js.
     * @param headers - Os cabeçalhos da requisição. O cabeçalho `Content-Type` é definido como `application/json` por padrão. 
     * O cabeçalho `Authorization` é definido com o token de autenticação, que é obtido via cookies.
     * @param rotaParaRedirecionar - A rota para redirecionar o usuário caso a requisição falhe. Se não for informada, a requisição irá retornar um erro. Deve incluir a / no início. Defina como null para não redirecionar.
     * 
     * @default headers - { "content-type": "application/json", "authorization": `Bearer ${cookies.get("authorization")?.value}` }
     * @default rotaParaRedirecionar - /login (apenas em caso de status 401)
     */
    static async get<T>({ url, cookies, headers, rotaParaRedirecionar }: { url: string, cookies: ReadonlyRequestCookies, headers?: HeadersInit, rotaParaRedirecionar?: string | null }): Promise<RespostaDaAPI<T>> {
        if (!process.env.URL_BASE_API) return { sucesso: false, message: "A URL base da API não foi informada." };
        if (!url) return { sucesso: false, message: "A URL da rota da API não foi informada." };

        const resposta_inicial = await fetch(process.env.URL_BASE_API + url, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${cookies.get("authorization")?.value}`,
                ...headers,
            },
        })

        // Por padrão, redireciona para a página de login em caso de erro 401
        if (resposta_inicial.status === 401 && typeof rotaParaRedirecionar === "undefined") return redirecionarViaAction(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(401))}`);

        const json = resposta_inicial.json();
        json.catch((erro) => {
            // Se for erro de JSON mal formatado, retorna o erro
            if (erro instanceof SyntaxError) return {
                sucesso: false,
                message: "Erro ao formatar a resposta da API."
            }

            return {
                sucesso: false,
                message: erro.message
            }
        });

        const json_resolvido = await json;

        if (!resposta_inicial.ok || respostaFoiErroDeAutenticacao(json_resolvido)) {
            if (rotaParaRedirecionar) return redirecionarViaAction(rotaParaRedirecionar);

            return {
                sucesso: false,
                message: mensagemDeErroPorCodigoHTTP(resposta_inicial.status)
            }
        }

        return {
            sucesso: true,
            resposta: Array.isArray(json_resolvido) ? json_resolvido : [json_resolvido]
        }
    }
}
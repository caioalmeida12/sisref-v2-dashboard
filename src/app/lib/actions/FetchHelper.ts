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

/**
 * Verifica se a resposta da API foi um erro. Para isso, verifica se o objeto é um objeto json e se possui a chave `message`.
 * 
 * Em alguns casos, a API retorna um objeto json com a chave `message` mas que não é um erro (por algum motivo -- espero que seja corrigido).
 * 
 * @param resposta um objeto json que foi retornado pela API
 * @returns true se a resposta foi um erro, false caso contrário
 */
const respostaFoiErro = (resposta: unknown) => {
    if (typeof resposta === 'object' && resposta !== null && 'message' in resposta) { return true; }

    return false;
}

/**
 * Função auxiliar para fazer requisições à API.
 * 
 * @param method - O método HTTP da requisição (GET, POST, etc.).
 * @param rota - A URL a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo.
 * @param cookies - Os cookies da requisição. Podem ser obtidos através da função `cookies()` do Next.js.
 * @param body - O corpo da requisição. Deve ser um objeto serializável em JSON.
 * @param headers - Os cabeçalhos da requisição. O cabeçalho `Content-Type` é definido como `application/json` por padrão. 
 * O cabeçalho `Authorization` é definido com o token de autenticação, que é obtido via cookies.
 * @param rotaParaRedirecionar - A rota para redirecionar o usuário caso a requisição falhe. Se não for informada, a requisição irá retornar um erro. Deve incluir a / no início. Defina como null para não redirecionar.
 * 
 * @default headers - { "content-type": "application/json", "authorization": `Bearer ${cookies.get("authorization")?.value}` }
 * @default rotaParaRedirecionar - /login (apenas em caso de status 401)
 */
const fetchAPI = async <T>({ method, rota, cookies, body, headers, rotaParaRedirecionar }: { method: string, rota: string, cookies: ReadonlyRequestCookies, body?: any, headers?: HeadersInit, rotaParaRedirecionar?: string | null }): Promise<RespostaDaAPI<T>> => {
    if (!process.env.URL_BASE_API) return { sucesso: false, message: "A URL base da API não foi informada." };
    if (!rota) return { sucesso: false, message: "A URL da rota da API não foi informada." };

    const resposta_inicial = await fetch(process.env.URL_BASE_API + rota, {
        method,
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${cookies.get("authorization")?.value}`,
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    // Por padrão, redireciona para a página de login em caso de erro 401
    if (resposta_inicial.status === 401 && typeof rotaParaRedirecionar === "undefined") return redirecionarViaAction(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(401))}`);

    try {
        const json_resolvido = await resposta_inicial.json();

        if (!resposta_inicial.ok) {
            if (rotaParaRedirecionar) return redirecionarViaAction(rotaParaRedirecionar);

            return redirecionarViaAction(`/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(resposta_inicial.status))}`);
        }

        if (respostaFoiErro(json_resolvido)) return { sucesso: false, message: json_resolvido.message }

        return {
            sucesso: true,
            resposta: Array.isArray(json_resolvido) ? json_resolvido : [json_resolvido]
        };
    } catch (erro) {
        // Se for erro de JSON mal formatado, retorna o erro
        if (erro instanceof SyntaxError) return redirecionarViaAction(`/login?erro=${encodeURIComponent("Erro ao processar a resposta da API.")}`);

        return redirecionarViaAction(`/login?erro=${encodeURIComponent("Erro desconhecido ao processar a resposta da API.")}`);
    }
}

export class FetchHelper {
    /**
     * Executa uma requisição GET para a API.
     * 
     * @param rota - A URL a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo.
     * @param cookies - Os cookies da requisição. Podem ser obtidos através da função `cookies()` do Next.js.
     * @param headers - Os cabeçalhos da requisição. O cabeçalho `Content-Type` é definido como `application/json` por padrão. 
     * O cabeçalho `Authorization` é definido com o token de autenticação, que é obtido via cookies.
     * @param rotaParaRedirecionar - A rota para redirecionar o usuário caso a requisição falhe. Se não for informada, a requisição irá retornar um erro. Deve incluir a / no início. Defina como null para não redirecionar.
     * 
     * @default headers - { "content-type": "application/json", "authorization": `Bearer ${cookies.get("authorization")?.value}` }
     * @default rotaParaRedirecionar - /login (apenas em caso de status 401)
     */
    static async get<T>({ rota, cookies, headers, rotaParaRedirecionar }: { rota: string, cookies: ReadonlyRequestCookies, headers?: HeadersInit, rotaParaRedirecionar?: string | null }): Promise<RespostaDaAPI<T>> {
        return fetchAPI<T>({ method: 'GET', rota, cookies, headers, rotaParaRedirecionar });
    }

    /**
     * Executa uma requisição POST para a API.
     * 
     * @param rota - A URL a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo.
     * @param cookies - Os cookies da requisição. Podem ser obtidos através da função `cookies()` do Next.js.
     * @param body - O corpo da requisição. Deve ser um objeto serializável em JSON.
     * @param headers - Os cabeçalhos da requisição. O cabeçalho `Content-Type` é definido como `application/json` por padrão. 
     * O cabeçalho `Authorization` é definido com o token de autenticação, que é obtido via cookies.
     * @param rotaParaRedirecionar - A rota para redirecionar o usuário caso a requisição falhe. Se não for informada, a requisição irá retornar um erro. Deve incluir a / no início. Defina como null para não redirecionar.
     * 
     * @default headers - { "content-type": "application/json", "authorization": `Bearer ${cookies.get("authorization")?.value}` }
     * @default rotaParaRedirecionar - /login (apenas em caso de status 401)
     */
    static async post<T>({ rota, cookies, body, headers, rotaParaRedirecionar }: { rota: string, cookies: ReadonlyRequestCookies, body: Record<string, any>, headers?: HeadersInit, rotaParaRedirecionar?: string | null }): Promise<RespostaDaAPI<T>> {
        return fetchAPI<T>({ method: 'POST', rota, cookies, body, headers, rotaParaRedirecionar });
    }

    /**
     * Executa uma requisição DELETE para a API.
     * 
     * @param rota - A URL a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo.
     * @param cookies - Os cookies da requisição. Podem ser obtidos através da função `cookies()` do Next.js.
     * @param headers - Os cabeçalhos da requisição. O cabeçalho `Content-Type` é definido como `application/json` por padrão. 
     * O cabeçalho `Authorization` é definido com o token de autenticação, que é obtido via cookies.
     * @param rotaParaRedirecionar - A rota para redirecionar o usuário caso a requisição falhe. Se não for informada, a requisição irá retornar um erro. Deve incluir a / no início. Defina como null para não redirecionar.
     * 
     * @default headers - { "content-type": "application/json", "authorization": `Bearer ${cookies.get("authorization")?.value}` }
     * @default rotaParaRedirecionar - /login (apenas em caso de status 401)
     */
    static async delete<T>({ rota, cookies, headers, rotaParaRedirecionar }: { rota: string, cookies: ReadonlyRequestCookies, headers?: HeadersInit, rotaParaRedirecionar?: string | null }): Promise<RespostaDaAPI<T>> {
        return fetchAPI<T>({ method: 'DELETE', rota, cookies, headers, rotaParaRedirecionar });
    }

    /**
     * Executa uma requisição PUT para a API.
     * 
     * @param rota - A URL a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo.
     * @param cookies - Os cookies da requisição. Podem ser obtidos através da função `cookies()` do Next.js.
     * @param body - O corpo da requisição. Deve ser um objeto serializável em JSON.
     * @param headers - Os cabeçalhos da requisição. O cabeçalho `Content-Type` é definido como `application/json` por padrão. 
     * O cabeçalho `Authorization` é definido com o token de autenticação, que é obtido via cookies.
     * @param rotaParaRedirecionar - A rota para redirecionar o usuário caso a requisição falhe. Se não for informada, a requisição irá retornar um erro. Deve incluir a / no início. Defina como null para não redirecionar.
     * 
     * @default headers - { "content-type": "application/json", "authorization": `Bearer ${cookies.get("authorization")?.value}` }
     * @default rotaParaRedirecionar - /login (apenas em caso de status 401)
     */
    static async put<T>({ rota, cookies, body, headers, rotaParaRedirecionar }: { rota: string, cookies: ReadonlyRequestCookies, body: Record<string, any>, headers?: HeadersInit, rotaParaRedirecionar?: string | null }): Promise<RespostaDaAPI<T>> {
        return fetchAPI<T>({ method: 'PUT', rota, cookies, body, headers, rotaParaRedirecionar });
    }
}
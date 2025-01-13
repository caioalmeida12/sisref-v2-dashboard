import { IResquisicaoPaginada } from "@/app/interfaces/IRequisicaoPaginada";

export class FetchRouteHandler {
    /**
     * Executa uma requisição GET para a API administrativa, do Next JS.
     *
     * @param path - O caminho da rota a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo. Deve começar com '/'.
     * @param paginacao - Os parâmetros de paginação para a requisição.
     * @param query - Outros parâmetros que a rota específica pode necessitar.
     * @returns A resposta da requisição fetch.
     */
    static get(path: string, paginacao: IResquisicaoPaginada, query?: string) {
        return fetch(`/api/administrativas?path=${path}&page=${paginacao.page}&perPage=${paginacao.per_page}${query ? '&' + query : ''}`);
    }
}
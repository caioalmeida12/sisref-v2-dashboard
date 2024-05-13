export const mensagemDeErroPorCodigoHTTP = (codigo: number) => (
    {
        400: "Requisição inválida",
        401: "Não autorizado",
        403: "Proibido",
        404: "Não encontrado",
        500: "Erro interno do servidor",
        502: "Gateway inválido",
        503: "Serviço indisponível",
        504: "Tempo de requisição esgotado"
    }[codigo] || "Erro ao conectar com o servidor"
)
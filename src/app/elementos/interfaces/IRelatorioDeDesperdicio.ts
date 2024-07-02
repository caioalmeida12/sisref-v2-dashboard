type RelatorioDeDesperdicioEncontrado = {
    id: number,
    startDate: string,
    endDate: string,
    content: string,
    created_at: string,
    updated_at: string
}

type RelatorioDeDesperdicioNaoEncontrado = {
    message: string
}

export type IRelatorioDeDesperdicio = RelatorioDeDesperdicioEncontrado | RelatorioDeDesperdicioNaoEncontrado
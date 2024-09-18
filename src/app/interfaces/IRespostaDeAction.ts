export type IRespostaDeAction<T> = {
    sucesso: false,
    mensagem: string
} | {
    sucesso: true,
    resposta: T[]
}

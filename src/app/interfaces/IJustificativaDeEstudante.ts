export const justificativasPermitidas = [
    { value: 1, label: "Eu estava em uma aula" },
    { value: 2, label: "Eu estava participando de uma atividade acadêmica (evento, palestra ou minicurso)." },
    { value: 3, label: "Eu fui a uma consulta médica." },
    { value: 4, label: "Eu marquei a refeição errada." },
    { value: 5, label: "Eu esqueci do horário da refeição." },
    { value: 6, label: "Eu tive uma mudança de apetite." },
    { value: 7, label: "Eu tive um mal-estar ou indisposição." },
    { value: 8, label: "Eu perdi a noção de tempo durante outra atividade." },
    { value: 9, label: "Eu tive problemas familiares." },
    { value: 10, label: "Eu tive problemas de transporte." },
    { value: 11, label: "Eu tive questões relacionadas à alimentação (ex. restrições alimentares)." },
    { value: 12, label: "Eu precisei realizar uma viagem de última hora." },
    { value: 13, label: "O sistema do RU não estava funcionando." },
] as const;

export type IJustificativaDeEstudante = typeof justificativasPermitidas[number]
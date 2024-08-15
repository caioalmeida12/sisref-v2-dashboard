/**
 * Converte uma string para camelCase (primeira letra de cada palavra em maiúscula). Preposições e artigos são mantidos em minúsculo.
 * @param string
 * @returns string em camelCase
 */
export const stringParaCamelCase = (string: string) => {
    const preposicoes = ["de", "da", "do", "das", "dos", "e"]

    return string.split(" ").map((palavra) => {
        // Se a palavra for uma preposição, retorna em minúsculo
        if (preposicoes.includes(palavra.toLowerCase())) return palavra.toLowerCase()

        // Caso contrário, coloca a primeira letra em maiúscula e o restante em minúscula
        return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
    }).join(" ")
}
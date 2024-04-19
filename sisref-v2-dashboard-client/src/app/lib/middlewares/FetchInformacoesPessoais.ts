import { IInformacoesPessoais } from "@/app/elementos/interfaces/IInformacoesPessoais";

export const fetchInformacoesPessoais = async (sub: number): Promise<IInformacoesPessoais | null> => {
    const fetchAuth = await fetch(`https://ruapi.cedro.ifce.edu.br/api/all/show-student/${sub}`);
    if (!fetchAuth.ok) return null;
    return await fetchAuth.json();
}
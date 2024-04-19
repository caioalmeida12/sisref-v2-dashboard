import { IInformacoesDeEstudante } from "@/app/elementos/interfaces/IInformacoesDeEstudante";

export const fetchInformacoesDeEstudante = async (sub: string): Promise<IInformacoesDeEstudante | null> => {
    const fetchAuth = await fetch(`https://ruapi.cedro.ifce.edu.br/api/all/show-student/${sub}`);
    if (!fetchAuth.ok) return null;
    return await fetchAuth.json();
}
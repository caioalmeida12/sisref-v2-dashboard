import { IInformacoesDeEstudante } from "@/app/elementos/interfaces/IInformacoesDeEstudante";
import { redirecionarViaAction } from "../actions/RedirecionarViaAction";

export const fetchInformacoesDeEstudante = async (sub: string): Promise<IInformacoesDeEstudante> => {
    try {
        const fetchAuth = await fetch(`${process.env.URL_BASE_API}/all/show-student/${sub}`);

        if (!fetchAuth.ok) return redirecionarViaAction()

        return await fetchAuth.json();
    } catch (error) {
        return redirecionarViaAction()
    }
}
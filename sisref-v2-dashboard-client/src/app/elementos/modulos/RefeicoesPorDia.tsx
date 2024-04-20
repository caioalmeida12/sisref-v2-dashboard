import { cookies } from "next/headers";
import { Refeicao } from "../componentes/Refeicao";
import { redirect } from "next/navigation";
import { Secao } from "../basicos/Secao";
import { Slider } from "../componentes/Slider";

export const RefeicoesPorDia = async ({ data = new Date().toISOString().split('T')[0] }: { data?: string }) => {
    const API_URL = new URL("https://ruapi.cedro.ifce.edu.br/api/all/menus-today")
    API_URL.searchParams.append('date', data);

    const response = await fetch(`${API_URL}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": cookies().get("authorization")?.value || redirect("/login")
        }
    });

    const refeicoes = await response.json();

    const array = Array.isArray(refeicoes) ? refeicoes : [refeicoes];

    const elementosRefeicoes = ([1, 2, 3, 4] as const).map((turno) => (
        <Refeicao key={turno} turno={turno} refeicao={
            array.find((refeicao) => refeicao.turno === turno)?.refeicao
        } cardapio={
            array.find((refeicao) => refeicao.turno === turno)?.cardapio
        } />
    ));

    return (
        <Secao className="flex flex-col gap-y-4 md:grid md:grid-cols-2 md:gap-4">
            <Slider texto="Refeições por dia" className="bg-preto-400 col-span-2"/>
            {elementosRefeicoes}


        </Secao>
    )
}
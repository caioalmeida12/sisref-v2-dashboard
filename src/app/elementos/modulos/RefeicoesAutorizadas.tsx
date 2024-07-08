import React from "react";
import { Secao } from "../basicos/Secao";
import { CabecalhoDeSecao } from "../basicos/CabecalhoDeSecao";
import { RefeicaoAutorizada } from "../componentes/RefeicaoAutorizada";
import { InformacoesDeEstudante } from "./InformacoesDeEstudante";
import { fetchRefeicoesAutorizadas } from "@/app/actions/fetchRefeicoesAutorizadas";
import { IFetchRefeicoesAutorizadas } from "../interfaces/IFetchRefeicoesAutorizadas";



const pegarOsDiasDaSemanaAutorizados = (refeicoesAutorizadas: IFetchRefeicoesAutorizadas[], idDaRefeicao: number) => {
    const diasQueSaoAutorizados: string[] = [];
    refeicoesAutorizadas
        .filter(refeicao => refeicao.meal_id === idDaRefeicao)
        .map(refeicao => {
            if (refeicao.monday === 1) diasQueSaoAutorizados.push("segunda-feira");
            if (refeicao.tuesday === 1) diasQueSaoAutorizados.push("terça-feira");
            if (refeicao.wednesday === 1) diasQueSaoAutorizados.push("quarta-feira");
            if (refeicao.thursday === 1) diasQueSaoAutorizados.push("quinta-feira");
            if (refeicao.friday === 1) diasQueSaoAutorizados.push("sexta-feira");
            if (refeicao.saturday === 1) diasQueSaoAutorizados.push("sábado");
        })

    if (diasQueSaoAutorizados.length === 6) return ["segunda a sábado"];
    if (diasQueSaoAutorizados.length === 5) return ["segunda a sexta"];
    if (diasQueSaoAutorizados.length === 0) return ["não autorizado"];

    return diasQueSaoAutorizados;
};

export const RefeicoesAutorizadas = async ({ forcarExibicao = false }: { forcarExibicao?: boolean }) => {
    const refeicoesAutorizadas = await fetchRefeicoesAutorizadas();

    type RefeicoesMap = {
        [K in 1 | 2 | 3 | 4]?: {
            refeicao: typeof refeicoesAutorizadas[number];
            dias: ReturnType<typeof pegarOsDiasDaSemanaAutorizados>;
        };
    };

    const refeicoes = ([1, 2, 3, 4] as const).reduce<RefeicoesMap>((acc, meal_id) => {
        const refeicao = refeicoesAutorizadas.find(refeicao => refeicao.meal.id === meal_id);
        const dias = pegarOsDiasDaSemanaAutorizados(refeicoesAutorizadas, meal_id);
        if (refeicao) {
            acc[meal_id] = { refeicao, dias };
        }
        return acc;
    }, {});

    return (
        <>
            <div className={`${true ? "block" : "hidden"}`}>
                <InformacoesDeEstudante versaoMobileCompleta />
            </div>
            <Secao className={`${true ? "flex" : "hidden"} flex-col gap-y-4 col-left`}>
                <CabecalhoDeSecao titulo="Refeições autorizadas" />
                {
                    Object.values(refeicoes).map((refeicao, index) => (
                        <RefeicaoAutorizada key={index} variante={(["manha", "almoco", "tarde", "noite"] as const)[index]} dias={refeicao.dias} />
                    ))
                }
            </Secao>
        </>
    );
};
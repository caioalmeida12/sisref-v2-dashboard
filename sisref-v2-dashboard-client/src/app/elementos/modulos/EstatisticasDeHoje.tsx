"use client"

import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { useEffect, useState } from "react";
import { Secao } from "../basicos/Secao"
import { IconeInformacao } from "../basicos/icones/IconeInformacao";
import { Slider } from "../componentes/Slider"
import { fetchRefeicoesPorDia } from "@/app/actions/fetchRefeicoesPorDia";
import { IRefeicao } from "../interfaces/IRefeicao";
import { Refeicao } from "../componentes/Refeicao";
import ReservasPorDia from "../componentes/ReservasPorDia";
import { TicketsPorDia } from "../componentes/TicketsPorDia";

const cache: { [data: string]: IRefeicao[] } = {};

export default function EstatisticasDeHoje() {
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [refeicoes, setRefeicoes] = useState<IRefeicao[]>([]);

    useEffect(() => {
        if (cache[data]) return setRefeicoes(cache[data]);

        fetchRefeicoesPorDia({ data })
            .then((refeicoes) => {
                refeicoes && setRefeicoes(refeicoes);

                cache[data] = refeicoes;
            })
            .catch((erro) => console.error(erro));
    }, [data])

    const textoData = new Date().toISOString().split('T')[0] === data ? "hoje" : DatasHelper.converterParaFormatoBrasileiro(data);

    const elementosRefeicao = ([1, 2, 3, 4] as const).map((turno) => (
        <Refeicao key={turno} turno={turno} refeicao={
            refeicoes.find((refeicao) => refeicao.turno === turno)?.refeicao
        } cardapio={
            refeicoes.find((refeicao) => refeicao.turno === turno)?.cardapio
        } />
    ));

    return (
        <Secao className={`flex flex-col gap-y-4 lg:grid lg:grid-cols-2 lg:gap-4`}>
            <Slider texto={`Estatísticas para ${textoData}`} className="bg-preto-400 col-span-2"
                onNext={() => {
                    const amanha = DatasHelper.getDataPosterior(data);
                    setData(amanha);
                }}

                onPrevious={() => {
                    const ontem = DatasHelper.getDataAnterior(data);
                    setData(ontem);
                }}

                tooltip={
                    (refeicoes.length) ? null : (
                        <IconeInformacao texto="Nenhuma refeição encontrada para esta data" />
                    )
                }
            />
            {elementosRefeicao}
            <div className="grid col-span-2 grid-cols-3">
                <ReservasPorDia className="col-start-1 col-end-3" textoDoCabecalho="Reservas por dia" data="16/06/2024" refeicoes={[
                    { nome: "Lanche da manhã", quantidade: 10 },
                    { nome: "Almoço", quantidade: 15 },
                    { nome: "Lanche da tarde", quantidade: 5 },
                    { nome: "Lanche da noite", quantidade: 20 }
                ]} />
                <TicketsPorDia className="col-start-3 col-end-4" tickets={[
                    { estado: "Utilizados", quantidade: 33 },
                    { estado: "Não utilizados", quantidade: 27 },
                    { estado: "Cancelados", quantidade: 11 },
                    { estado: "Faltosos", quantidade: 5 },
                ]} />
            </div>
        </Secao>
    )
}

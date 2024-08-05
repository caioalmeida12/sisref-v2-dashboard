"use client"

import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { useState } from "react";
import { Secao } from "../basicos/Secao"
import { IconeInformacao } from "../basicos/icones/IconeInformacao";
import { Slider } from "../componentes/Slider"
import { fetchRefeicoesPorDia } from "@/app/actions/fetchRefeicoesPorDia";
import { IRefeicao } from "../interfaces/IRefeicao";
import { Refeicao, RefeicaoLoading } from "../componentes/Refeicao/Refeicao";
import ReservasPorDia from "../componentes/ReservasPorDia";
import { TicketsPorDia } from "../componentes/TicketsPorDia";
import { TicketsPorRefeicao } from "../componentes/TicketsPorRefeicao";
import { useQuery } from "@tanstack/react-query";

export default function EstatisticasDeHoje() {
    const [dataDaPesquisa, setDataDaPesquisa] = useState(new Date().toISOString().split('T')[0]);
    const textoData = new Date().toISOString().split('T')[0] === dataDaPesquisa ? "hoje" : DatasHelper.converterParaFormatoBrasileiro(dataDaPesquisa);

    const { data: refeicoes, isLoading } = useQuery({
        queryKey: ['refeicoesPorDia', dataDaPesquisa],
        queryFn: () => fetchRefeicoesPorDia({ data: dataDaPesquisa })
    });

    const elementosRefeicao = ([1, 2, 3, 4] as const).map((turno) => {
        if (isLoading) {
            return <RefeicaoLoading key={turno} />
        }

        return (
            <Refeicao key={turno} turno={turno} refeicao={
                refeicoes.find((refeicao: IRefeicao) => refeicao.refeicao?.id === turno)?.refeicao
            } cardapio={
                refeicoes.find((refeicao: IRefeicao) => refeicao.refeicao?.id === turno)?.cardapio
            } />
        )
    });

    return (
        <Secao className={`flex flex-col gap-y-4 lg:grid lg:grid-cols-2 lg:gap-4`}>
            <Slider texto={`Estatísticas para ${textoData}`} className="bg-preto-400 col-span-2"
                onNext={() => {
                    const amanha = DatasHelper.getDataPosterior(dataDaPesquisa);
                    setDataDaPesquisa(amanha);
                }}

                onPrevious={() => {
                    const ontem = DatasHelper.getDataAnterior(dataDaPesquisa);
                    setDataDaPesquisa(ontem);
                }}

                tooltip={
                    (refeicoes?.length) ? null : (
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
            <div className="grid col-span-2 grid-cols-4">
                <TicketsPorRefeicao refeicao="Lanche da manhã" tickets={[
                    { estado: "Utilizados", quantidade: 15 },
                    { estado: "Não utilizados", quantidade: 10 },
                    { estado: "Cancelados", quantidade: 5 },
                    { estado: "Faltosos", quantidade: 2 },
                ]} />
                <TicketsPorRefeicao refeicao="Almoço" tickets={[
                    { estado: "Utilizados", quantidade: 20 },
                    { estado: "Não utilizados", quantidade: 15 },
                    { estado: "Cancelados", quantidade: 6 },
                    { estado: "Faltosos", quantidade: 4 },
                ]} />
                <TicketsPorRefeicao refeicao="Lanche da tarde" tickets={[
                    { estado: "Utilizados", quantidade: 10 },
                    { estado: "Não utilizados", quantidade: 5 },
                    { estado: "Cancelados", quantidade: 0 },
                    { estado: "Faltosos", quantidade: 0 },
                ]} />
                <TicketsPorRefeicao refeicao="Lanche da noite" tickets={[
                    { estado: "Utilizados", quantidade: 25 },
                    { estado: "Não utilizados", quantidade: 20 },
                    { estado: "Cancelados", quantidade: 0 },
                    { estado: "Faltosos", quantidade: 5 },
                ]} />
            </div>
        </Secao>
    )
}

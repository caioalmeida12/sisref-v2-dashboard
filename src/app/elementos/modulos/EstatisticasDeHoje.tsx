"use client"

import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { useState } from "react";
import { Secao } from "../basicos/Secao"
import { Slider } from "../componentes/Slider"
import { fetchRefeicoesPorDia } from "@/app/actions/fetchRefeicoesPorDia";
import { IRefeicao } from "../interfaces/IRefeicao";
import { Refeicao, RefeicaoLoading } from "../componentes/Refeicao/Refeicao";
import ReservasPorDia from "../componentes/ReservasPorDia";
import { TicketsPorDia } from "../componentes/TicketsPorDia";
import { TicketsPorRefeicao } from "../componentes/TicketsPorRefeicao";
import { useQuery } from "@tanstack/react-query";
import Icone from "../basicos/Icone";
import { CustomTooltipWrapper } from "../basicos/CustomTooltipWrapper";

export default function EstatisticasDeHoje() {
    const [dataDaPesquisa, setDataDaPesquisa] = useState(new Date().toISOString().split('T')[0]);
    const textoData = new Date().toISOString().split('T')[0] === dataDaPesquisa ? "hoje" : DatasHelper.converterParaFormatoBrasileiro(dataDaPesquisa);

    const { data: refeicoes, isLoading } = useQuery({
        queryKey: ['refeicoesPorDia', dataDaPesquisa],
        queryFn: () => fetchRefeicoesPorDia({ data: dataDaPesquisa })
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
                    <CustomTooltipWrapper
                        elementoContent={
                            <p>
                                Nenhuma estatística encontrada para esta data.
                            </p>
                        }
                        elementoTrigger={
                            <div className="my-auto">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-vermelho-400">
                                    <path d="M6.6 4.2H5.4V3H6.6M6.6 9H5.4V5.4H6.6M6 0C5.21207 0 4.43185 0.155195 3.7039 0.456723C2.97595 0.758251 2.31451 1.20021 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.31451 10.7998 2.97595 11.2417 3.7039 11.5433C4.43185 11.8448 5.21207 12 6 12C7.5913 12 9.11742 11.3679 10.2426 10.2426C11.3679 9.11742 12 7.5913 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 0 6 0Z" />
                                </svg>
                            </div>
                        }
                    />
                }
            />
            {
                isLoading &&
                ([1, 2, 3, 4] as const).map((_, index) => (
                    <RefeicaoLoading key={index} />
                ))
            }
            {
                refeicoes &&
                ([1, 2, 3, 4] as const).map((turno) => (
                    <Refeicao key={turno} turno={turno} refeicao={
                        refeicoes.find((refeicao: IRefeicao) => refeicao.refeicao?.id === turno)?.refeicao
                    } />
                ))
            }
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

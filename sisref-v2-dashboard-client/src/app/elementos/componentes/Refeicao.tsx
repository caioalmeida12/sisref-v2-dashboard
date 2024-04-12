import { Botao } from "../basicos/Botao";
import { HorarioDaRefeicao } from "../basicos/HorarioDaRefeicao";
import { NomeDaRefeicao } from "../basicos/NomeDaRefeicao";
import { Secao } from "../basicos/Secao";
import { StatusDaRefeicao } from "../basicos/StatusDaRefeicao";

interface Refeicao {
    turno: 1 | 2 | 3 | 4;
    refeicao?: {
        description: string;
        qtdTimeReservationEnd: number;
        qtdTimeReservationStart: number;
        timeEnd: string;
        timeStart: string;
    }
    cardapio?: {
        agendado: boolean;
        date: string;
        description: string;
        permission: boolean;
        id: number;
        campus_id: number;
    }
}

const varianteDoNomeDaRefeicaoPorTurno = {
    1: "manha",
    2: "almoco",
    3: "tarde",
    4: "noite"
} as const;

const descricaoDeCardapioParaArrayDeStrings = (descricao: string) => {
    return descricao.split(/[;+]/).map((texto) => texto)
}

const RefeicaoCurta = (props: Refeicao) => {
    return (
        <Secao>
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteDoNomeDaRefeicaoPorTurno[props.turno]} />
                <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Reservado" />
            </div>
        </Secao>
    )
}

const RefeicaoLongaSemBotao = (props: Refeicao) => {
    if (!props.refeicao) return <RefeicaoCurta turno={props.turno} />

    return (
        <Secao className="flex flex-col gap-y-2">
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteDoNomeDaRefeicaoPorTurno[props.turno]} />
                <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Reservado" />
            </div>
            <HorarioDaRefeicao variante="horario" horarios={props.refeicao} />
            <p className="leading-6">
                {descricaoDeCardapioParaArrayDeStrings(props.refeicao.description).map((descricao) => (
                    <>
                    {descricao} <br/>
                    </>
                ))}
            </p>
        </Secao>
    )
}

const RefeicaoLongaComBotao = (props: Refeicao) => {
    if (!props.refeicao) return <RefeicaoCurta turno={props.turno} />

    return (
        <Secao className="flex flex-col gap-y-2">
            <div className="flex justify-between">
                <NomeDaRefeicao variante={varianteDoNomeDaRefeicaoPorTurno[props.turno]} />
                <StatusDaRefeicao cor="verde-300" icone="circulo-check" texto="Reservado" />
            </div>
            <HorarioDaRefeicao variante="horario" horarios={props.refeicao} />
            <p className="leading-6">
                {descricaoDeCardapioParaArrayDeStrings(props.refeicao.description).map((descricao) => (
                    <>
                    {descricao} <br/>
                    </>
                ))}
            </p>
            <Botao texto="Adicionar" variante="adicionar" />
        </Secao>
    )
}

export const Refeicao = (props: Refeicao) => {
    if (props.cardapio?.agendado) return <RefeicaoLongaComBotao {...props} />
    return <RefeicaoLongaSemBotao {...props} />
}
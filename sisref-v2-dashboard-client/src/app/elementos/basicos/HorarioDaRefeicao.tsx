import React from 'react'

import { IApenasHorario, IApenasData, IHorarioEData } from "@elementos/interfaces/IHorarios";
import classnames from 'classnames';

type HorarioDaRefeicaoProps =
    | IApenasHorario
    | IApenasData
    | IHorarioEData

const textoPorVariante = (props: HorarioDaRefeicaoProps) => {
    switch (props.variante) {
        case "horario":
            return `${props.horarios.timeStart}h às ${props.horarios.timeEnd}h`;
        case "data":
            return `${props.data}`;
        case "horario-e-data":
            return `${props.data} - ${props.horarios.timeStart}h às ${props.horarios.timeEnd}h`;
    }
}

export const HorarioDaRefeicao = (props: HorarioDaRefeicaoProps & Partial<HTMLParagraphElement>) => {
    return (
        <p className={classnames('text-cinza-600', props.className)}>
            {textoPorVariante(props)}
        </p>
    )
}
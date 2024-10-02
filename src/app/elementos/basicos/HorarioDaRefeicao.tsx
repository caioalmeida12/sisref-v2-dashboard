import React from "react";

import {
  IApenasHorario,
  IApenasData,
  IHorarioEData,
} from "@/app/interfaces/IHorarios";
import classnames from "classnames";

type HorarioDaRefeicaoProps = IApenasHorario | IApenasData | IHorarioEData;

// Recebe uma string no formato "HH:MM:SS" e retorna "HH:MM"
const removerSegundos = (horario: string) => horario.slice(0, 5);

const textoPorVariante = (props: HorarioDaRefeicaoProps) => {
  switch (props.variante) {
    case "horario":
      return `${removerSegundos(props.horarios.timeStart)}h às ${removerSegundos(props.horarios.timeEnd)}h`;
    case "data":
      return `${removerSegundos(props.data)}`;
    case "horario-e-data":
      return `${removerSegundos(props.data)} - ${removerSegundos(props.horarios.timeStart)}h às ${removerSegundos(props.horarios.timeEnd)}h`;
  }
};

export const HorarioDaRefeicao = (
  props: HorarioDaRefeicaoProps & Partial<HTMLParagraphElement>,
) => {
  return (
    <p className={classnames("text-cinza-600", props.className)}>
      {textoPorVariante(props)}
    </p>
  );
};

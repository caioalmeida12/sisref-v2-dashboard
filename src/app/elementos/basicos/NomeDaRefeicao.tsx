import React from "react";
import classnames from "classnames";
import Icone from "./Icone";
import { TRefeicao } from "@/app/interfaces/TRefeicao";

interface NomeDaRefeicaoProps {
  className?: string;
  refeicao: TRefeicao;
}

export const NomeDaRefeicao: React.FC<NomeDaRefeicaoProps> = ({
  refeicao,
  className,
}) => {
  return (
    <div className={classnames("flex items-center gap-x-2", className)}>
      <Icone.Refeicao
        variante={["manha", "almoco", "tarde", "noite"][refeicao.id - 1]}
      />
      <span className="font-bold">{refeicao.description}</span>
    </div>
  );
};

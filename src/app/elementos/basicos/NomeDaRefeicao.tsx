import React from "react";
import classnames from "classnames";
import Icone from "./Icone";

interface NomeDaRefeicaoProps {
  variante: keyof typeof nomePorVariante;
  className?: string;
}

const nomePorVariante = {
  manha: "Lanche da manhã",
  almoco: "Almoço",
  tarde: "Lanche da tarde",
  noite: "Lanche da noite",
} as const;

export const NomeDaRefeicao: React.FC<NomeDaRefeicaoProps> = ({
  variante,
  className,
}) => {
  return (
    <div className={classnames("flex items-center gap-x-2", className)}>
      <Icone.menu variante={variante} />
      <span className="font-bold">{nomePorVariante[variante]}</span>
    </div>
  );
};

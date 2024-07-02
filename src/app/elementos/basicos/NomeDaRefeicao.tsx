import React from 'react'

import { IconeRefeicao } from "./icones/IconeRefeicao";

interface NomeDaRefeicaoProps {
    variante: keyof typeof nomePorVariante;
}

const nomePorVariante = {
    "manha": "Lanche da manhã",
    "almoco": "Almoço",
    "tarde": "Lanche da tarde",
    "noite": "Lanche da noite",
} as const;

export const NomeDaRefeicao = ({ variante }: NomeDaRefeicaoProps) => {
    return (
        <div className="flex gap-x-2 items-center">
            <IconeRefeicao variante={variante} />
            <span className="font-bold">{nomePorVariante[variante]}</span>
        </div>
    )
}
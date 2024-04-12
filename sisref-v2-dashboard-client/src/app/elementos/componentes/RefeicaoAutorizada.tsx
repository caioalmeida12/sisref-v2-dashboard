import React from "react";
import { NomeDaRefeicao } from "../basicos/NomeDaRefeicao";

interface RefeicaoAutorizadaProps {
    variante: keyof typeof horarioPorVariante;
}

const horarioPorVariante = {
    "manha": "9:20 - 9:50",
    "almoco": "11:20 - 13:00",
    "tarde": "14:45 - 15:35",
    "noite": "20:00 - 20:20",
} as const;

export const RefeicaoAutorizada = ({ variante}: RefeicaoAutorizadaProps) => {
    return (
        <div className="flex p-4 flex-col gap-4 rounded border-cinza-600 text-preto-400">
            <div className="flex justify-between items-start">
                <NomeDaRefeicao variante={variante}/>  
                <span className="text-cinza-600">{horarioPorVariante[variante]}</span>
            </div>
            <div>
                <b>Dias autorizados:</b> <span>segunda-feira, terça-feira, quarta-feira, quinta-feira, sexta-feira</span>
            </div>
        </div>
    )
}
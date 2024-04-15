import { NomeDaRefeicao } from "../basicos/NomeDaRefeicao";
import { HorarioDaRefeicao, Horarios } from "../basicos/HorarioDaRefeicao";

interface RefeicaoAutorizadaProps {
    variante: keyof typeof horarioPorVariante;
    horarios: Horarios;
    dias: string[];
}

const horarioPorVariante = {
    "manha": { qtdTimeReservationEnd: 9, qtdTimeReservationStart: 20, timeEnd: "9:50", timeStart: "9:20" },
    "almoco": { qtdTimeReservationEnd: 11, qtdTimeReservationStart: 20, timeEnd: "13:00", timeStart: "11:20" },
    "tarde": { qtdTimeReservationEnd: 14, qtdTimeReservationStart: 45, timeEnd: "15:35", timeStart: "14:45" },
    "noite": { qtdTimeReservationEnd: 20, qtdTimeReservationStart: 0, timeEnd: "20:20", timeStart: "20:00" },
} as const;

export const RefeicaoAutorizada = ({ variante, dias }: RefeicaoAutorizadaProps) => {
    return (
        <div className="flex p-4 flex-col gap-4 rounded border-cinza-600 text-preto-400">
            <div className="flex justify-between items-start">
                <NomeDaRefeicao variante={variante}/>  
                <HorarioDaRefeicao variante="horario" horarios={horarioPorVariante[variante]} />
            </div>
            <div>
                <b>Dias autorizados:</b> <span>{dias.join(', ')}</span>
            </div>
        </div>
    )
}
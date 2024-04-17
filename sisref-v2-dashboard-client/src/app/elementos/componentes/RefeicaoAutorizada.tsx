import { NomeDaRefeicao } from "@elementos/basicos/NomeDaRefeicao";
import { HorarioDaRefeicao } from "@elementos/basicos/HorarioDaRefeicao";
import { Secao } from "@elementos/basicos/Secao";
import { IHorarios } from "../interfaces/IHorarios";

interface RefeicaoAutorizadaProps {
    variante: keyof typeof horarioPorVariante;
    horarios: IHorarios;
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
        <Secao>
            <div className="flex flex-col gap-y-4 rounded">
                <div className="flex justify-between items-start">
                    <NomeDaRefeicao variante={variante} />
                    <HorarioDaRefeicao variante="horario" horarios={horarioPorVariante[variante]} />
                </div>
                <div>
                    <b>Dias autorizados:</b> <span>{dias.map((dia) => dia.toLocaleLowerCase()).join(', ')}</span>
                </div>
            </div>
        </Secao>
    )
}
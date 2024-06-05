import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { Secao } from "../basicos/Secao";
import { Botao } from "../basicos/Botao";

interface RelatorioDesperdicioProps {
        "id": 8,
        "startDate": "2024-06-01",
        "endDate": "2024-06-30",
        "content": "<figure class=\"table\"><table><tbody><tr><td>&nbsp;<\/td><td>&nbsp;<\/td><td>&nbsp;<\/td><\/tr><tr><td>&nbsp;<\/td><td>&nbsp;<\/td><td>&nbsp;<\/td><\/tr><tr><td>&nbsp;<\/td><td>&nbsp;<\/td><td>&nbsp;<\/td><\/tr><\/tbody><\/table><\/figure>",
        "created_at": "2024-06-05 08:32:29",
        "updated_at": "2024-06-05 08:32:29"
}

const Card = ({ content, date }: RelatorioDesperdicioProps) => {
    return (
        <Secao className="flex flex-col gap-y-2">
            <p className="font-bold">{DatasHelper.converterParaFormatoBrasileiro(date)}</p>

            <p>{content}</p>

            <Botao variante="remover" texto="Remover"></Botao>
        </Secao>
    )
}

export const RelatorioDesperdicio = ({ content, date, variante }: RelatorioDesperdicioProps & { variante: "card" | "modal" }) => {
    return variante === "card" ? <Card content={content} date={date} /> : null
}
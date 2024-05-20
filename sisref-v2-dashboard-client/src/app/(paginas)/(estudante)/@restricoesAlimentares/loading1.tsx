import { Botao } from "@/app/elementos/basicos/Botao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { RestricaoAlimentar } from "@/app/elementos/basicos/RestricaoAlimentar";
import { Secao } from "@/app/elementos/basicos/Secao";
import { TextoDescritivo } from "@/app/elementos/modulos/RestricoesAlimentares/TextoDescritivo";
import { Skeleton } from "@mui/material";

export default function Loading() {
    return (
        <div className={`flex lg:flex flex-col gap-4 `}>
            <TextoDescritivo />
            <Secao className="flex flex-col gap-4">
                <CabecalhoDeSecao titulo="Suas restrições alimentares" />
                {
                    Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} variant="rectangular" className="p-8" />
                    ))
                }
                <Botao texto="Adicionar" variante="adicionar" />
            </Secao>
        </div>
    )
}
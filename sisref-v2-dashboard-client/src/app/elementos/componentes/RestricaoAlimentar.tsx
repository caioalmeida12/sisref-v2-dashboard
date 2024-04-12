import { IconeRestricaoAlimentar } from "../basicos/icones/IconeRestricaoAlimentar";

interface RestricaoAlimentarProps {
    variante: keyof typeof restricaoPorVariante;
}

const restricaoPorVariante = {
    "gluten": "Restrição a glúten",
    "lactose": "Restrição a lactose",
} as const;

export const RestricaoAlimentar = ({ variante }: RestricaoAlimentarProps) => {
    return (
        <div className="flex p-4 justify-between item-center relative rounded border-2 border-cinza-600">
            <div className="flex gap-2 items-center relative">
                <IconeRestricaoAlimentar />
                <p className="font-bold leading-4 text-sm text-preto-400">{restricaoPorVariante[variante]}</p>
            </div>
            <div className="flex gap-2 items-center relative text-vermelho-400">
               <a href="">Remover</a>
            </div>
        </div>
        
    )
}
import { IconeSeta } from "@elementos/basicos/icones/IconeSeta";

interface SliderProps {
    texto: string;
}

export const Slider = ({ texto }: SliderProps) => {
    return (
        <div className="p-4 bg-cinza-600 text-center text-branco-400 font-bold rounded justify-between flex items-center">
            <IconeSeta fill="fill-branco-400" direcao="esquerda"/>
            {texto}
            <IconeSeta fill="fill-branco-400" direcao="direita"/>
        </div>
    );
}
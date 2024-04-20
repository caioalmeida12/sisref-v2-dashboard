import { IconeSeta } from "@elementos/basicos/icones/IconeSeta";

interface SliderProps extends React.HTMLAttributes<HTMLDivElement>{
    texto: string;
}

export const Slider = ({ texto, ...rest }: SliderProps) => {
    return (
        <div className={`${rest.className} p-4 bg-cinza-600 text-center text-branco-400 font-bold rounded justify-between flex items-center`}>
            <IconeSeta fill="fill-branco-400" direcao="esquerda"/>
            {texto}
            <IconeSeta fill="fill-branco-400" direcao="direita"/>
        </div>
    );
}
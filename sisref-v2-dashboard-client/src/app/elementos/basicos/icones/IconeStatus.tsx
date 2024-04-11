import { SVGProps } from "react";

interface IconeStatusProps extends SVGProps<SVGSVGElement> {
    fill: string;
    variante: "circulo-x" | "circulo-check" | "tag-x";
}

const CirculoComX = ({ fill }: { fill: IconeStatusProps["fill"]}) => {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={fill || "fill-cinza-600"}>
            <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM9 8.154L8.154 9L6 6.846L3.846 9L3 8.154L5.154 6L3 3.846L3.846 3L6 5.154L8.154 3L9 3.846L6.846 6L9 8.154Z" />
        </svg>
    )
}

const CirculoComCheck = ({ fill }: { fill: IconeStatusProps["fill"]}) => {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={fill || "fill-cinza-600"}>
            <path d="M6 0C2.688 0 0 2.688 0 6C0 9.312 2.688 12 6 12C9.312 12 12 9.312 12 6C12 2.688 9.312 0 6 0ZM4.8 9L1.8 6L2.646 5.154L4.8 7.302L9.354 2.748L10.2 3.6L4.8 9Z"/>
        </svg>
    )
}

const TagComX = ({ fill }: { fill: IconeStatusProps["fill"]}) => {
    return (
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={fill || "fill-cinza-600"}>
            <path d="M12.2222 0H3.88889C3.50556 0 3.20556 0.194445 3.00556 0.488889L0 5L3.00556 9.50556C3.20556 9.8 3.50556 10 3.88889 10H12.2222C12.8333 10 13.3333 9.5 13.3333 8.88889V1.11111C13.3333 0.5 12.8333 0 12.2222 0ZM10.5556 6.99444L9.77222 7.77778L7.77778 5.78333L5.78333 7.77778L5 6.99444L6.99444 5L5 3.00556L5.78333 2.22222L7.77778 4.21667L9.77222 2.22222L10.5556 3.00556L8.56111 5L10.5556 6.99444Z"/>
        </svg>
    )
}

const statusPorVariante = {
    "circulo-x": CirculoComX,
    "circulo-check": CirculoComCheck,
    "tag-x": TagComX
}

export const IconeStatus = ({ fill, variante }: IconeStatusProps) => {
    const Icone = statusPorVariante[variante];
    return <Icone fill={fill}/>
}
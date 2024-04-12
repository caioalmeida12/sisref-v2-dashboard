import { SVGProps } from "react";

interface IconeStatusProps extends SVGProps<SVGSVGElement> {
    fill: string;
    variante: "circulo-x" | "circulo-check" | "tag-x" | "cadeado";
}

const CirculoComX = ({ fill }: { fill: IconeStatusProps["fill"] }) => {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={fill || "fill-cinza-600"}>
            <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM9 8.154L8.154 9L6 6.846L3.846 9L3 8.154L5.154 6L3 3.846L3.846 3L6 5.154L8.154 3L9 3.846L6.846 6L9 8.154Z" />
        </svg>
    )
}

const CirculoComCheck = ({ fill }: { fill: IconeStatusProps["fill"] }) => {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={fill || "fill-cinza-600"}>
            <path d="M6 0C2.688 0 0 2.688 0 6C0 9.312 2.688 12 6 12C9.312 12 12 9.312 12 6C12 2.688 9.312 0 6 0ZM4.8 9L1.8 6L2.646 5.154L4.8 7.302L9.354 2.748L10.2 3.6L4.8 9Z" />
        </svg>
    )
}

const TagComX = ({ fill }: { fill: IconeStatusProps["fill"] }) => {
    return (
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={fill || "fill-cinza-600"}>
            <path d="M12.2222 0H3.88889C3.50556 0 3.20556 0.194445 3.00556 0.488889L0 5L3.00556 9.50556C3.20556 9.8 3.50556 10 3.88889 10H12.2222C12.8333 10 13.3333 9.5 13.3333 8.88889V1.11111C13.3333 0.5 12.8333 0 12.2222 0ZM10.5556 6.99444L9.77222 7.77778L7.77778 5.78333L5.78333 7.77778L5 6.99444L6.99444 5L5 3.00556L5.78333 2.22222L7.77778 4.21667L9.77222 2.22222L10.5556 3.00556L8.56111 5L10.5556 6.99444Z" />
        </svg>
    )
}

const Cadeado = ({ fill }: { fill: IconeStatusProps["fill"] }) => {
    return (
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={fill}>
            <path d="M4.57143 9.14286C4.87453 9.14286 5.16522 9.02245 5.37955 8.80812C5.59388 8.59379 5.71429 8.3031 5.71429 8C5.71429 7.36571 5.2 6.85714 4.57143 6.85714C4.26832 6.85714 3.97763 6.97755 3.76331 7.19188C3.54898 7.40621 3.42857 7.6969 3.42857 8C3.42857 8.3031 3.54898 8.59379 3.76331 8.80812C3.97763 9.02245 4.26832 9.14286 4.57143 9.14286ZM8 4C8.3031 4 8.59379 4.12041 8.80812 4.33474C9.02245 4.54906 9.14286 4.83975 9.14286 5.14286V10.8571C9.14286 11.1602 9.02245 11.4509 8.80812 11.6653C8.59379 11.8796 8.3031 12 8 12H1.14286C0.839753 12 0.549062 11.8796 0.334735 11.6653C0.120408 11.4509 0 11.1602 0 10.8571V5.14286C0 4.50857 0.514286 4 1.14286 4H1.71429V2.85714C1.71429 2.09938 2.01531 1.37266 2.55112 0.836838C3.08694 0.30102 3.81367 0 4.57143 0C4.94663 0 5.31817 0.0739022 5.66481 0.217487C6.01145 0.361072 6.32642 0.571528 6.59173 0.836838C6.85704 1.10215 7.0675 1.41712 7.21108 1.76376C7.35467 2.11041 7.42857 2.48194 7.42857 2.85714V4H8ZM4.57143 1.14286C4.11677 1.14286 3.68074 1.32347 3.35925 1.64496C3.03775 1.96645 2.85714 2.40249 2.85714 2.85714V4H6.28571V2.85714C6.28571 2.40249 6.1051 1.96645 5.78361 1.64496C5.46212 1.32347 5.02609 1.14286 4.57143 1.14286Z" fill="#D7AF70" />
        </svg>
    )
}

const statusPorVariante: {
    [variante in IconeStatusProps["variante"]]: (props: { fill: IconeStatusProps["fill"] }) => JSX.Element;
} = {
    "circulo-x": CirculoComX,
    "circulo-check": CirculoComCheck,
    "tag-x": TagComX,
    "cadeado": Cadeado
}

export const IconeStatus = ({ fill, variante }: IconeStatusProps) => {
    const Icone = statusPorVariante[variante];
    return <Icone fill={fill} />
}
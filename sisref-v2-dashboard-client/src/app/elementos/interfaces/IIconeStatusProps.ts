import { SVGProps } from "react";

export interface IIconeStatusProps extends SVGProps<SVGSVGElement> {
    fill: string;
    variante: "circulo-x" | "circulo-check" | "tag-x" | "cadeado" | "relogio-x";
}
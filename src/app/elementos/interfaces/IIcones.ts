import { HTMLAttributes, SVGProps } from "react";

export interface IIconeDropdownProps extends HTMLAttributes<HTMLElement> { variante?: "sem-circulo"; }
export interface IIconeFecharProps extends React.SVGProps<SVGSVGElement> { }
export interface IIconeInformacaoProps extends HTMLAttributes<HTMLElement> { texto: string; cor?: string }
export interface IIconeMenuProps extends React.SVGProps<SVGSVGElement> { }
export interface IIconeRefeicaoProps extends SVGProps<SVGSVGElement> { variante: "manha" | "almoco" | "tarde" | "noite"; }
export interface IIconeSetaProps extends SVGProps<SVGSVGElement> { fill: string; direcao: "cima" | "baixo" | "esquerda" | "direita"; }
export interface IIconeStatusProps extends SVGProps<SVGSVGElement> {
    fill: string;
    variante: "circulo-x" | "circulo-check" | "tag-x" | "cadeado" | "relogio-x";
}
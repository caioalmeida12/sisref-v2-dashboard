import { HTMLAttributes, SVGProps } from "react";

export type IIconesDisponiveis =
  | "Confirmar"
  | "Deletar"
  | "Editar"
  | "Adicionar"
  | "Aviso"
  | "Dropdown"
  | "Fechar"
  | "Informacao"
  | "Logout"
  | "Menu"
  | "Refeicao"
  | "RestricaoAlimentar"
  | "Seta"
  | "Status"
  | "Usuario"
  | "Calendario"
  | "GarfoEFaca"
  | "Casa"
  | "EstudanteComChapeu"
  | "Ampulheta"
  | "GraficoDeBarras"
  | "Lixeira"
  | "Chave"
  | "Armario"
  | "RefeicoesAutorizadas";

export interface IIconeDropdownProps extends HTMLAttributes<HTMLElement> {
  variante?: "sem-circulo";
}
export interface IIconeFecharProps extends React.SVGProps<SVGSVGElement> { }
export interface IIconeMenuProps extends React.SVGProps<SVGSVGElement> { }
export interface IIconeRefeicaoProps extends SVGProps<SVGSVGElement> {
  variante: "manha" | "almoco" | "tarde" | "noite" | (string & {});
}
export interface IIconeSetaProps extends SVGProps<SVGSVGElement> {
  fill: string;
  direcao: "cima" | "baixo" | "esquerda" | "direita";
}
export interface IIconeStatusProps extends SVGProps<SVGSVGElement> {
  fill: string;
  variante: "circulo-x" | "circulo-check" | "tag-x" | "cadeado" | "relogio-x";
}

import React, { HTMLAttributes, SVGProps } from 'react';
import { IIconeStatusProps } from '../../interfaces/IIconeStatusProps';
import { _IconeAviso } from './_IconeAviso';
import { _IconeDropdown } from './_IconeDropdown';
import { _IconeFechar } from './_IconeFechar';
import { _IconeInformacao } from './_IconeInformacao';
import { _IconeLogout } from './_IconeLogout';
import { _IconeMenu } from './_IconeMenu';
import { _IconeRefeicao } from './_IconeRefeicao';
import { _IconeRestricaoAlimentar } from './_IconeRestricaoAlimentar';
import { _IconeSeta } from './_IconeSeta';
import { _IconeStatus } from './_IconeStatus';

export interface IIconeDropdownProps extends HTMLAttributes<HTMLElement> { variante?: "sem-circulo"; }
export interface IIconeFecharProps extends React.SVGProps<SVGSVGElement> { }
export interface IIconeInformacaoProps extends HTMLAttributes<HTMLElement> { texto: string; cor?: string }
export interface IIconeMenuProps extends React.SVGProps<SVGSVGElement> { }
export interface IIconeRefeicaoProps extends SVGProps<SVGSVGElement> { variante: "manha" | "almoco" | "tarde" | "noite"; }
export interface IIconeSetaProps extends SVGProps<SVGSVGElement> { fill: string; direcao: "cima" | "baixo" | "esquerda" | "direita"; }

const Icone = ({ children }: { children: React.ReactNode }) => children;

Icone.Aviso = () => <_IconeAviso />;
Icone.Dropdown = (props: IIconeDropdownProps) => <_IconeDropdown {...props} />;
Icone.Fechar = (props: IIconeFecharProps) => <_IconeFechar {...props} />;
Icone.Informacao = (props: IIconeInformacaoProps) => <_IconeInformacao {...props} />;
Icone.Logout = () => <_IconeLogout />;
Icone.Menu = (props: IIconeMenuProps) => <_IconeMenu {...props} />;
Icone.Refeicao = (props: IIconeRefeicaoProps) => <_IconeRefeicao {...props} />;
Icone.RestricaoAlimentar = () => <_IconeRestricaoAlimentar />;
Icone.Seta = (props: IIconeSetaProps) => <_IconeSeta {...props} />;
Icone.Status = (props: IIconeStatusProps) => <_IconeStatus {...props} />;

export default Icone;

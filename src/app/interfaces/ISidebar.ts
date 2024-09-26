import { IInformacoesDeLogin } from "@/app/lib/middlewares/IInformacoesDeLogin";
import { IIconesDisponiveis } from "./IIcones";

export type IItemDaSidebarSemDropdown = {
  titulo: string;
  rota: string;
  icone: IIconesDisponiveis;
  isDropdown?: false;
};

export type IItemDaSidebarComDropdown = {
  titulo: string;
  isDropdown: true;
  itens: {
    titulo: string;
    rota: string;
    icone: IIconesDisponiveis;
  }[];
};

export type IItemDaSidebar =
  | IItemDaSidebarSemDropdown
  | IItemDaSidebarComDropdown;

export type ISidebarProps = {
  tipo_de_usuario: IInformacoesDeLogin["classification"];
  itens: IItemDaSidebar[];
};

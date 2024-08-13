import { _Cancelar } from "./_Cancelar"
import { _ModalDeCancelar } from "./_ModalDeCancelar"
import { _Reservar } from "./_Reservar"

export interface IBotaoDeRefeicaoProps { meal_id?: number, date?: string, ref_botao_fechar?: React.RefObject<HTMLButtonElement> }

export const BotaoDeRefeicao = () => { }

BotaoDeRefeicao.Cancelar = (props: Required<IBotaoDeRefeicaoProps>) => <_Cancelar {...props} />
BotaoDeRefeicao.Reservar = (props: IBotaoDeRefeicaoProps) => <_Reservar {...props} />
BotaoDeRefeicao.AbrirModalDeCancelar = (props: IBotaoDeRefeicaoProps) => <_ModalDeCancelar {...props} />
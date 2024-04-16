import { DatasHelper } from "@/app/lib/elementos/DatasHelper"
import { CabecalhoPrincipal } from "../basicos/CabecalhoPrincipal"
import { Secao } from "../basicos/Secao"
import { CampoDeSecao } from "../componentes/CampoDeSecao"
import { IInformacoesPessoais } from "../interfaces/IInformacoesPessoais"

export const InformacoesPessoais = ({id, name, course, campus, active, dateValid, mat, shift_id, photo }: IInformacoesPessoais) => {
    return (
        <Secao className='grid gap-y-4'>
            <CabecalhoPrincipal titulo="Informações pessoais" />
            <CampoDeSecao titulo="Nome" complemento={name} variante="horizontal" />
            <CampoDeSecao titulo='Curso' complemento={course.description} variante='horizontal' />
            <div className="flex gap-x-4">
                <CampoDeSecao titulo="Código" complemento={mat} variante='horizontal-com-badge' corDaBadge='bg-azul-400' />
                <CampoDeSecao titulo="Validade" complemento={DatasHelper.converterParaFormatoBrasileiro(dateValid)} variante='horizontal-com-badge' corDaBadge='bg-verde-300' />
            </div>
        </Secao>
    )
}
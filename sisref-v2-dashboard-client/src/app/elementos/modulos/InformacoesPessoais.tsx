import { DatasHelper } from "@/app/lib/elementos/DatasHelper"
import { CabecalhoPrincipal } from "../basicos/CabecalhoPrincipal"
import { Secao } from "../basicos/Secao"
import { CampoDeSecao } from "../componentes/CampoDeSecao"
import { IInformacoesPessoais } from "../interfaces/IInformacoesPessoais"
import { CabeçalhoDeSecao } from "../basicos/CabecalhoDeSecao"

const shiftIdParaTurno = {
    1: "Integral",
    2: "Manhã",
    3: "Tarde",
    4: "Noite"
} as const

const Mobile = ({ name, course, mat, dateValid }: IInformacoesPessoais) => {
    return (
        <Secao className="grid gap-y-4">
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

const Desktop = ({ name, course, mat, dateValid, campus, shift_id }: IInformacoesPessoais) => {
    return (
        <Secao className="grid gap-y-4">
            <CabeçalhoDeSecao titulo="Informações pessoais" />
            <CampoDeSecao titulo="Nome" complemento={name} variante="vertical" />
            <CampoDeSecao titulo="Matrícula" complemento="20211035000020" variante="vertical" />
            <div className="flex gap-x-4 justify-between">
                <CampoDeSecao titulo="Código" complemento={mat} variante='vertical-com-badge' corDaBadge='bg-azul-400' />
                <CampoDeSecao titulo="Validade" complemento={DatasHelper.converterParaFormatoBrasileiro(dateValid)} variante='vertical-com-badge' corDaBadge='bg-verde-300' />
            </div>
            <CampoDeSecao titulo='Curso' complemento={course.description} variante='vertical' />
            <div className="flex gap-x-4 justify-between">
                <CampoDeSecao titulo="Campus" complemento={campus.description} variante="vertical" />
                <CampoDeSecao titulo="Turno" complemento={shiftIdParaTurno[shift_id]} variante="vertical" />
            </div>
        </Secao>
    )
}

export const InformacoesPessoais = ({ id, name, course, campus, active, dateValid, mat, shift_id, photo }: IInformacoesPessoais) => {
    const json = { id, name, course, campus, active, dateValid, mat, shift_id, photo }

    return (
        <>
            <div className="md:hidden">
                <Mobile {...json} />
            </div>
            <div className="hidden md:block">
                <Desktop {...json} />
            </div>
        </>
    )
}
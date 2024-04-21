import { DatasHelper } from "@/app/lib/elementos/DatasHelper"
import { CabecalhoPrincipal } from "@elementos/basicos/CabecalhoPrincipal"
import { Secao } from "@elementos/basicos/Secao"
import { CampoDeSecao } from "../componentes/CampoDeSecao"
import { IInformacoesDeEstudante } from "../interfaces/IInformacoesDeEstudante"
import { CabeçalhoDeSecao } from "@elementos/basicos/CabecalhoDeSecao"
import { IInformacoesDoCampus } from "../interfaces/IInformacoesDoCampus"
import { fetchInformacoesDoCampus } from "@/app/lib/elementos/FetchInformacoesDoCampus"
import { fetchInformacoesDeEstudante } from "@/app/lib/middlewares/FetchInformacoesDoEstudante"
import { validarTokenDosCookies } from "@/app/lib/middlewares/ValidarTokenDosCookies"

interface InformacoesDeEstudanteProps {
    estudante: IInformacoesDeEstudante
    campus: IInformacoesDoCampus
}

const shiftIdParaTurno = {
    1: "Integral",
    2: "Manhã",
    3: "Tarde",
    4: "Noite"
} as const

const Mobile = ({ estudante }: InformacoesDeEstudanteProps) => {
    return (
        <Secao className="grid gap-y-4 md:hidden">
            <CabecalhoPrincipal titulo="Informações pessoais" />
            <CampoDeSecao titulo="Nome" complemento={estudante.name} variante="horizontal" />
            <CampoDeSecao titulo='Curso' complemento={estudante.course.description} variante='horizontal' />
            <div className="flex gap-x-4">
                <CampoDeSecao titulo="Código" complemento={String(estudante.id)} variante='horizontal-com-badge' corDaBadge='bg-azul-400' />
                <CampoDeSecao titulo="Validade" complemento={DatasHelper.converterParaFormatoBrasileiro(estudante.dateValid)} variante='horizontal-com-badge' corDaBadge='bg-verde-300' />
            </div>
        </Secao>
    )
}

const Desktop = ({ estudante, campus }: InformacoesDeEstudanteProps) => {
    return (
        <Secao className="hidden md:grid md:gap-y-4 container">
            <CabeçalhoDeSecao titulo="Informações pessoais" />
            <CampoDeSecao titulo="Nome" complemento={estudante.name} variante="vertical" />
            <CampoDeSecao titulo="Matrícula" complemento="20211035000020" variante="vertical" />
            <div className="flex gap-x-4 justify-between">
                <CampoDeSecao titulo="Código" complemento={String(estudante.id)} variante='vertical-com-badge' corDaBadge='bg-azul-400' />
                <CampoDeSecao titulo="Validade" complemento={DatasHelper.converterParaFormatoBrasileiro(estudante.dateValid)} variante='vertical-com-badge' corDaBadge='bg-verde-300' />
            </div>
            <CampoDeSecao titulo='Curso' complemento={estudante.course.description} variante='vertical' />
            <div className="flex gap-x-4 justify-between">
                <CampoDeSecao titulo="Campus" complemento={campus.description} variante="vertical" />
                <CampoDeSecao titulo="Turno" complemento={shiftIdParaTurno[estudante.shift_id]} variante="vertical" />
            </div>
        </Secao>
    )
}

export const InformacoesDeEstudante = async () => {
    const validado = validarTokenDosCookies()

    const informacoesDeEstudante = await fetchInformacoesDeEstudante(validado.sub);

    const informacoesDoCampus = await fetchInformacoesDoCampus(String(informacoesDeEstudante.campus_id));

    return (
        <>
                <Mobile estudante={informacoesDeEstudante} campus={informacoesDoCampus} />
                <Desktop estudante={informacoesDeEstudante} campus={informacoesDoCampus} />
        </>
    )
}
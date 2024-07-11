import React from "react"

import { DatasHelper } from "@/app/lib/elementos/DatasHelper"
import { CabecalhoPrincipal } from "@elementos/basicos/CabecalhoPrincipal"
import { Secao } from "@elementos/basicos/Secao"
import { CampoDeSecao } from "../componentes/CampoDeSecao"
import { IInformacoesDeEstudante } from "../interfaces/IInformacoesDeEstudante"
import { CabecalhoDeSecao } from "@elementos/basicos/CabecalhoDeSecao"
import { IInformacoesDoCampus } from "../interfaces/IInformacoesDoCampus"
import { fetchInformacoesDoCampus } from "@/app/lib/elementos/FetchInformacoesDoCampus"
import { fetchInformacoesDeEstudante } from "@/app/lib/middlewares/FetchInformacoesDeEstudante"
import { validarTokenDosCookies } from "@/app/lib/middlewares/ValidarTokenDosCookies"
import Image from "next/image"

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

/**
 * Converte uma string para camelCase (primeira letra de cada palavra em maiúscula). Preposições e artigos são mantidos em minúsculo.
 * @param string
 * @returns string em camelCase
 */
const stringParaCamelCase = (string: string) => {
    const preposicoes = ["de", "da", "do", "das", "dos", "e"]

    return string.split(" ").map((palavra) => {
        // Se a palavra for uma preposição, retorna em minúsculo
        if (preposicoes.includes(palavra.toLowerCase())) return palavra.toLowerCase()

        // Caso contrário, coloca a primeira letra em maiúscula e o restante em minúscula
        return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
    }).join(" ")
}

const Mobile = ({ estudante }: InformacoesDeEstudanteProps) => {
    return (
        <Secao className="flex flex-col gap-y-4 lg:hidden" id="informacoesDeEstudante">
            <CabecalhoPrincipal titulo="Informações pessoais" />
            <CampoDeSecao titulo="Nome" complemento={stringParaCamelCase(estudante.name)} variante="horizontal" />
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
        <Secao className="hidden lg:flex lg:flex-col lg:gap-y-4 col-left">
            <CabecalhoDeSecao titulo="Informações pessoais" />
            <CampoDeSecao titulo="Nome" complemento={stringParaCamelCase(estudante.name)} variante="vertical" />
            <CampoDeSecao titulo="Matrícula" complemento={estudante.mat} variante="vertical" />
            <div className="flex gap-x-4 justify-between">
                <CampoDeSecao titulo="Código" complemento={String(estudante.id)} variante='vertical-com-badge' corDaBadge='bg-azul-400' />
                <CampoDeSecao titulo="Validade" complemento={DatasHelper.converterParaFormatoBrasileiro(estudante.dateValid)} variante='vertical-com-badge' corDaBadge='bg-verde-300' />
            </div>
            <CampoDeSecao titulo='Curso' complemento={estudante.course.description} variante='vertical' />
            <div className="flex gap-x-4 justify-between">
                <CampoDeSecao titulo="Campus" complemento={stringParaCamelCase(campus.description)} variante="vertical" />
                <CampoDeSecao titulo="Turno" complemento={shiftIdParaTurno[estudante.shift_id]} variante="vertical" />
            </div>
        </Secao>
    )
}

const MobileCompleta = ({ estudante, campus }: InformacoesDeEstudanteProps) => {
    return (
        <Secao className="flex flex-col gap-y-4 lg:hidden" id="informacoesDeEstudante">
            <CabecalhoDeSecao titulo="Informações pessoais" />
            <div className="flex justify-center p-4">
            <Image className="rounded-full" src={estudante.photo || "/imgs/usuario.png"} width={100} height={100} alt="Imagem de usuário" />
            </div>
            <CampoDeSecao titulo="Nome" complemento={stringParaCamelCase(estudante.name)} variante="vertical" />
            <CampoDeSecao titulo="Matrícula" complemento="20211035000020" variante="vertical" />
            <div className="flex gap-x-4 justify-between">
                <CampoDeSecao titulo="Código" complemento={String(estudante.id)} variante='vertical-com-badge' corDaBadge='bg-azul-400' />
                <CampoDeSecao titulo="Validade" complemento={DatasHelper.converterParaFormatoBrasileiro(estudante.dateValid)} variante='vertical-com-badge' corDaBadge='bg-verde-300' />
            </div>
            <CampoDeSecao titulo='Curso' complemento={estudante.course.description} variante='vertical' />
            <div className="flex gap-x-4 justify-between">
                <CampoDeSecao titulo="Campus" complemento={stringParaCamelCase(campus.description)} variante="vertical" />
                <CampoDeSecao titulo="Turno" complemento={shiftIdParaTurno[estudante.shift_id]} variante="vertical" />
            </div>
        </Secao>
    )
}

export const InformacoesDeEstudante = async ({ versaoMobileCompleta = false } : { versaoMobileCompleta?: boolean }) => {
    const validado = validarTokenDosCookies()

    const informacoesDeEstudante = await fetchInformacoesDeEstudante(validado.sub);

    const informacoesDoCampus = await fetchInformacoesDoCampus(String(informacoesDeEstudante.campus_id));

    if (versaoMobileCompleta) return (
        <MobileCompleta estudante={informacoesDeEstudante} campus={informacoesDoCampus} />
    )

    return (
        <>
            <Mobile estudante={informacoesDeEstudante} campus={informacoesDoCampus} />
            <Desktop estudante={informacoesDeEstudante} campus={informacoesDoCampus} />
        </>
    )
}
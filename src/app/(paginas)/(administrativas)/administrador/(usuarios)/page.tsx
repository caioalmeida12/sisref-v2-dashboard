"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { createColumnHelper } from "@tanstack/react-table";
import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { ModalGeral } from "@/app/elementos/modulos/comuns/ModalGeral/ModalGeral";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";
import { BotaoDiv } from "@/app/elementos/basicos/BotaoDiv";
import { buscarUsuarios, editarUsuario, removerUsuario } from "@/app/actions/administrador";
import { buscarCampi } from "@/app/actions/campus";
import { criarCurso } from "@/app/actions/assistencia_estudantil";

export default function NutricionistaPage() {
    const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
        queryKey: ["tabelaDeUsuarios"],
        queryFn: async () => {
            const resposta = await buscarUsuarios();
            return resposta.sucesso ? resposta.resposta : [];
        },
        initialData: [],
    });

    const { data: campi, isFetching: isLoadingCampi } = useQuery({
        queryKey: ["tabelaDeCampi"],
        queryFn: async () => {
            const resposta = await buscarCampi();
            return resposta.sucesso ? resposta.resposta : [];
        },
        initialData: [],
    });

    const colunasHelper = createColumnHelper<(typeof dadosDaTabela)[number]>();

    const colunas = useMemo(() => [
        colunasHelper.accessor("id", {
            cell: props => props.getValue(),
            header: "ID"
        }),
        colunasHelper.accessor("name", {
            cell: props => props.getValue(),
            header: "Nome"
        }),
        colunasHelper.accessor("email", {
            cell: props => props.getValue(),
            header: "Email",
        }),
        colunasHelper.accessor("type", {
            cell: props => props.getValue(),
            header: "Tipo",
        }),
        colunasHelper.accessor("campus_id", {
            cell: props => props.getValue(),
            header: "Campus",
        }),
        colunasHelper.accessor("login", {
            cell: props => props.getValue(),
            header: "Login"
        }),
        colunasHelper.accessor("student_id", {
            cell: props => props.getValue(),
            header: "Código"
        }),
        colunasHelper.accessor((props) => props.active ? "Ativo" : "Inativo", {
            cell: props => props.getValue(),
            header: "Situação"
        }),
        colunasHelper.display({
            cell: (props) => (
                <div className="flex justify-center gap-x-2">
                    <div className="relative h-5 w-5 flex gap-x-2">
                        <ModalGeral
                            textoTitulo="Remover usuário"
                            elementoTrigger={
                                <CustomTooltipWrapper
                                    elementoContent={"Remover usuário"}
                                    elementoTrigger={
                                        <div className="relative h-5 w-5 cursor-pointer">
                                            <Icone.Deletar className="absolute inset-0 block h-full w-full" />
                                        </div>
                                    }
                                />
                            }
                            tipoDeBotaoPrincipal="remover"
                            textoDescricao={["Você está prestes a remover o usuário abaixo:"]}
                            elementoDescricao={(
                                <ul className="list-disc pl-5 mt-2">
                                    <li>
                                        ID: <strong>{props.row.original.id}</strong>
                                    </li>
                                    <li>
                                        Nome: <strong>{props.row.original.name}</strong>
                                    </li>
                                    <li>
                                        Email: <strong>{props.row.original.email}</strong>
                                    </li>
                                    <li>
                                        Tipo: <strong>{props.row.original.type}</strong>
                                    </li>
                                    <li>
                                        Campus: <strong>{props.row.original.campus_id}</strong>
                                    </li>
                                    <li>
                                        Login: <strong>{props.row.original.login}</strong>
                                    </li>
                                    <li>
                                        Código: <strong>{props.row.original.student_id}</strong>
                                    </li>
                                </ul>
                            )}
                            formulario={{
                                action: removerUsuario,
                                campos: [{
                                    type: "hidden",
                                    value: props.row.original.id,
                                    name: 'id',
                                }],
                                queryKeysParaInvalidar: [["tabelaDeUsuarios"]],
                                substantivoParaMensagemDeRetorno: "usuário"
                            }}
                        />
                    </div>
                    <div className="relative h-5 w-5 flex gap-x-2">
                        {/* O modal está feito da maneira correta, mas o backend está interpretando o campo active de alguma maneira estranha que nao deixa salvar no BD */}
                        <ModalGeral
                            textoDescricao={["Modifique os campos abaixo para editar o usuário."]}
                            elementoTrigger={
                                <CustomTooltipWrapper
                                    elementoContent={"Editar usuário"}
                                    elementoTrigger={
                                        <div className="relative h-5 w-5 cursor-pointer">
                                            <Icone.Editar className="absolute inset-0 block h-full w-full" />
                                        </div>
                                    }
                                />
                            }
                            textoTitulo="Editar usuário"
                            tipoDeBotaoPrincipal="confirmar"
                            formulario={{
                                action: editarUsuario,
                                campos: [{
                                    type: "hidden",
                                    name: "id",
                                    value: props.row.original.id
                                }, {
                                    type: "text",
                                    label: "Nome",
                                    name: "name",
                                    placeholder: "Nome do usuário",
                                    defaultValue: props.row.original.name
                                }, {
                                    type: "text",
                                    label: "Email",
                                    name: "email",
                                    placeholder: "Email do usuário",
                                    defaultValue: props.row.original.email ?? undefined
                                }, {
                                    type: "text",
                                    label: "Tipo",
                                    name: "type",
                                    placeholder: "Tipo do usuário",
                                    defaultValue: props.row.original.type
                                }, {
                                    type: "text",
                                    label: "Campus",
                                    name: "campus_id",
                                    placeholder: "Campus do usuário",
                                    defaultValue: props.row.original.campus_id ?? undefined
                                }, {
                                    type: "radio",
                                    label: "Situação",
                                    name: "active",
                                    placeholder: "ex: Ativo, Inativo",
                                    opcoes: () => [{
                                        texto: "Ativo",
                                        valor: 1
                                    }, {
                                        texto: "Inativo",
                                        valor: 0
                                    }],
                                    defaultValue: props.row.original.active
                                }],
                                queryKeysParaInvalidar: [["tabelaDeUsuarios"]],
                                substantivoParaMensagemDeRetorno: "usuário"
                            }}
                        />
                    </div>
                </div>
            ),
            header: "Ações"
        })
    ], [])

    return (
        <Secao className="min-w-[768px] border-none">
            <Secao className="mx-auto flex max-w-[1440px] flex-col gap-y-4">
                <CabecalhoDeSecao titulo="Usuários" />
                {/* <Secao className="flex flex-wrap gap-y-2 justify-end">
                    <div className="flex items-end gap-x-4">
                        <ModalGeral
                            elementoTrigger={
                                <BotaoDiv
                                    texto="Cadastrar usuário"
                                    variante="adicionar"
                                    className="h-[36px] border-none px-10 py-2 leading-tight !text-branco-400 hover:!outline-preto-400 md:whitespace-nowrap"
                                />
                            }
                            textoTitulo="Cadastrar o usuário"
                            textoDescricao={["Preencha os campos abaixo para cadastrar um novo usuário."]}
                            tipoDeBotaoPrincipal="confirmar"
                            formulario={{
                                action: criarCurso,
                                campos: [{
                                    type: "text",
                                    label: "Nome",
                                    name: "name",
                                    placeholder: "Nome do usuário",
                                }, {
                                    type: "text",
                                    label: "Email",
                                    name: "email",
                                    placeholder: "Email do usuário",
                                }, {
                                    type: "select",
                                    name: "type",
                                    estaCarregando: false,
                                    label: "Tipo",
                                    placeholder: "STUDENT",
                                    opcoes: () => [{
                                        texto: "Estudante",
                                        valor: "STUDENT"
                                    }, {
                                        texto: "Nutricionista",
                                        valor: "NUTRI"
                                    }, {
                                        texto: "Assistência Estudantil",
                                        valor: "ASSIS_ESTU"
                                    }, {
                                        texto: "Recepcionista",
                                        valor: "RECEPCAO"
                                    }, {
                                        texto: "Administrador",
                                        valor: "ADMIN"
                                    }],
                                    defaultValue: "STUDENT"
                                }, {
                                    type: "select",
                                    label: "Campus",
                                    name: "campus_id",
                                    placeholder: "Campus do usuário",
                                    estaCarregando: isLoadingCampi,
                                    opcoes: () => campi.map(campus => ({ texto: campus.description, valor: campus.id }))
                                }, {
                                    type: "text",
                                    label: "Login",
                                    name: "login",
                                    placeholder: "Login do usuário",
                                }, {
                                    type: "radio",
                                    label: "Situação",
                                    name: "active",
                                    placeholder: "ex: Ativo, Inativo",
                                    opcoes: () => [{
                                        texto: "Ativo",
                                        valor: 1
                                    }, {
                                        texto: "Inativo",
                                        valor: 0
                                    }],
                                }],
                                queryKeysParaInvalidar: [["tabelaDeUsuarios"]],
                                substantivoParaMensagemDeRetorno: "usuário"
                            }}
                        />
                    </div>
                </Secao> */}
                <Secao>
                    <TabelaDeCrud
                        colunas={colunas}
                        dados={dadosDaTabela ?? []}
                        estaCarregando={isLoadingDadosDaTabela || isLoadingCampi}
                        ordenacaoPadrao={[{ id: "id", desc: true }]}
                    />
                </Secao>
            </Secao>
        </Secao>
    );
}
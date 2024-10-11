"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { createColumnHelper } from "@tanstack/react-table";
import { buscarRepublicas, criarRepublica, editarRepublica, removerRepublica } from "@/app/actions/assistencia_estudantil";
import { ModalGeral } from "@/app/elementos/modulos/comuns/ModalGeral/ModalGeral";
import { BotaoDiv } from "@/app/elementos/basicos/BotaoDiv";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";

export default function NutricionistaPage() {
  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ["tabelaDeRepublicas"],
    queryFn: async () => {
      const resposta = await buscarRepublicas();
      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: [],
  });

  const colunasHelper = createColumnHelper<(typeof dadosDaTabela)[number]>();

  const colunas = useMemo(
    () => [
      colunasHelper.accessor("id", {
        cell: (props) => props.getValue(),
        header: "ID",
        id: "id",
      }),
      colunasHelper.accessor("description", {
        cell: (props) => props.getValue(),
        header: "Descrição",
      }),
      colunasHelper.accessor("address", {
        cell: (props) => props.getValue(),
        header: "Endereço",
        size: 450
      }),
      colunasHelper.accessor("neighborhood", {
        cell: (props) => props.getValue(),
        header: "Bairro",
      }),
      colunasHelper.accessor("city", {
        cell: (props) => props.getValue(),
        header: "Cidade",
      }),
      colunasHelper.accessor("ownerRepublic", {
        cell: (props) => props.getValue(),
        header: "Responsável",
        size: 450
      }),
      colunasHelper.accessor("valueRepublic", {
        cell: (props) => props.getValue(),
        header: "Valor",
      }),
      colunasHelper.display({
        cell: (props) => (
          <div className="flex justify-center gap-x-2">
            <div className="relative h-5 w-5 flex gap-x-2">
              <ModalGeral
                textoTitulo="Remover república"
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent={"Remover república"}
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Deletar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
                tipoDeBotaoPrincipal="remover"
                textoDescricao={["Você está prestes a remover a república abaixo:"]}
                elementoDescricao={(
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      Descrição: <strong>{props.row.original.description}</strong>
                    </li>
                    <li>
                      Endereço: <strong>{props.row.original.address}</strong>
                    </li>
                    <li>
                      Bairro: <strong>{props.row.original.neighborhood}</strong>
                    </li>
                    <li>
                      Cidade: <strong>{props.row.original.city}</strong>
                    </li>
                    <li>
                      Responsável: <strong>{props.row.original.ownerRepublic}</strong>
                    </li>
                    <li>
                      Valor: <strong>{props.row.original.valueRepublic}</strong>
                    </li>
                  </ul>
                )}
                formulario={{
                  action: removerRepublica,
                  campos: [{
                    type: "hidden",
                    value: props.row.original.id,
                    name: 'id',
                  }],
                  queryKeysParaInvalidar: [["tabelaDeRepublicas"]],
                  substantivoParaMensagemDeRetorno: "república"
                }}
              />
            </div>
            <div className="relative h-5 w-5 flex gap-x-2">
              <ModalGeral
                textoDescricao={["Modifique os campos abaixo para editar a república."]}
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent={"Editar república"}
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Editar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
                textoTitulo="Editar república"
                tipoDeBotaoPrincipal="confirmar"
                formulario={{
                  action: editarRepublica,
                  campos: [{
                    type: "hidden",
                    name: "id",
                    value: props.row.original.id
                  }, {
                    type: "text",
                    label: "Descrição",
                    name: "description",
                    placeholder: "ex: República 27",
                    defaultValue: props.row.original.description
                  }, {
                    type: "text",
                    label: "Endereço",
                    name: "address",
                    placeholder: "ex: Alameda José Quintino, 4",
                    defaultValue: props.row.original.address
                  }, {
                    type: "text",
                    label: "Bairro",
                    name: "neighborhood",
                    placeholder: "ex: Prado",
                    defaultValue: props.row.original.neighborhood
                  }, {
                    type: "text",
                    label: "Cidade",
                    name: "city",
                    placeholder: "ex: Cedro",
                    defaultValue: props.row.original.city
                  }, {
                    type: "text",
                    label: "Responsável",
                    name: "ownerRepublic",
                    placeholder: "ex: Reponsável da Silva Júnior",
                    defaultValue: props.row.original.ownerRepublic
                  }, {
                    type: "number",
                    label: "Valor",
                    name: "valueRepublic",
                    max: 10000,
                    min: 0,
                    placeholder: "ex: 300",
                    defaultValue: props.row.original.valueRepublic
                  }],
                  queryKeysParaInvalidar: [["tabelaDeRepublicas"]],
                  substantivoParaMensagemDeRetorno: "república"
                }}
              />
            </div>
          </div>
        ),
        header: "Ações"
      })
    ],
    [],
  );

  return (
    <Secao className="min-w-[768px] border-none">
      <Secao className="mx-auto flex max-w-[1440px] flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Repúblicas" />
        <Secao className="flex flex-wrap gap-y-2 justify-end">
          <div className="flex items-end gap-x-4">
            <ModalGeral
              elementoTrigger={
                <BotaoDiv
                  texto="Cadastrar república"
                  variante="adicionar"
                  className="h-[36px] border-none px-10 py-2 leading-tight !text-branco-400 hover:!outline-preto-400 md:whitespace-nowrap"
                />
              }
              textoTitulo="Cadastrar nova república"
              textoDescricao={["Preencha os campos abaixo para cadastrar uma nova república."]}
              tipoDeBotaoPrincipal="confirmar"
              formulario={{
                action: criarRepublica,
                campos: [{
                  type: "text",
                  label: "Descrição",
                  name: "description",
                  placeholder: "ex: República 27",
                }, {
                  type: "text",
                  label: "Endereço",
                  name: "address",
                  placeholder: "ex: Alameda José Quintino, 4"
                }, {
                  type: "text",
                  label: "Bairro",
                  name: "neighborhood",
                  placeholder: "ex: Prado"
                }, {
                  type: "text",
                  label: "Cidade",
                  name: "city",
                  placeholder: "ex: Cedro"
                }, {
                  type: "text",
                  label: "Responsável",
                  name: "ownerRepublic",
                  placeholder: "ex: Reponsável da Silva Júnior"
                }, {
                  type: "number",
                  label: "Valor",
                  name: "valueRepublic",
                  max: 10000,
                  min: 0,
                  placeholder: "ex: 300"
                }],
                queryKeysParaInvalidar: [["tabelaDeRepublicas"]],
                substantivoParaMensagemDeRetorno: "república"
              }}
            />
          </div>
        </Secao>
        <Secao>
          <TabelaDeCrud
            colunas={colunas}
            dados={dadosDaTabela ?? []}
            estaCarregando={isLoadingDadosDaTabela}
            ordenacaoPadrao={[{ id: "id", desc: false }]}
          />
        </Secao>
      </Secao>
    </Secao>
  );
}

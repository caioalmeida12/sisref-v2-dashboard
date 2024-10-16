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
import {
  criarCampus,
  editarCampus,
  removerCampus,
} from "@/app/actions/administrador";
import { buscarCampi } from "@/app/actions/campus";

export default function Page() {
  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ["tabelaDeCampi"],
    queryFn: async () => {
      const resposta = await buscarCampi();
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
      }),
      colunasHelper.accessor("description", {
        cell: (props) => props.getValue(),
        header: "Descrição",
      }),
      colunasHelper.display({
        cell: (props) => (
          <div className="flex justify-center gap-x-2">
            <div className="relative flex h-5 w-5 gap-x-2">
              <ModalGeral
                textoTitulo="Remover campus"
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent={"Remover campus"}
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Deletar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
                tipoDeBotaoPrincipal="remover"
                textoDescricao={[
                  "Você está prestes a remover o campus abaixo:",
                ]}
                elementoDescricao={
                  <ul className="mt-2 list-disc pl-5">
                    <li>
                      ID: <strong>{props.row.original.id}</strong>
                    </li>
                    <li>
                      Descrição:{" "}
                      <strong>{props.row.original.description}</strong>
                    </li>
                  </ul>
                }
                formulario={{
                  action: removerCampus,
                  campos: [
                    {
                      type: "hidden",
                      value: props.row.original.id,
                      name: "id",
                    },
                  ],
                  queryKeysParaInvalidar: [["tabelaDeCampi"]],
                  substantivoParaMensagemDeRetorno: "campus",
                }}
              />
            </div>
            <div className="relative flex h-5 w-5 gap-x-2">
              <ModalGeral
                textoDescricao={[
                  "Modifique os campos abaixo para editar o campus.",
                ]}
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent={"Editar campus"}
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Editar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
                textoTitulo="Editar campus"
                tipoDeBotaoPrincipal="confirmar"
                formulario={{
                  action: editarCampus,
                  campos: [
                    {
                      type: "hidden",
                      name: "id",
                      value: props.row.original.id,
                    },
                    {
                      type: "text",
                      label: "Descrição",
                      name: "description",
                      placeholder: "ex: Morada Nova",
                      defaultValue: props.row.original.description,
                    },
                  ],
                  queryKeysParaInvalidar: [["tabelaDeCampi"]],
                  substantivoParaMensagemDeRetorno: "campus",
                }}
              />
            </div>
          </div>
        ),
        header: "Ações",
      }),
    ],
    [],
  );

  return (
    <Secao className="min-w-[768px] border-none">
      <Secao className="mx-auto flex max-w-[1440px] flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Campi" />
        <Secao className="flex flex-wrap justify-end gap-y-2">
          <div className="flex items-end gap-x-4">
            <ModalGeral
              elementoTrigger={
                <BotaoDiv
                  texto="Cadastrar campus"
                  variante="adicionar"
                  className="h-[36px] border-none px-10 py-2 leading-tight !text-branco-400 hover:!outline-preto-400 md:whitespace-nowrap"
                />
              }
              textoTitulo="Cadastrar campus"
              textoDescricao={[
                "Preencha os campos abaixo para cadastrar um novo campus.",
              ]}
              tipoDeBotaoPrincipal="confirmar"
              formulario={{
                action: criarCampus,
                campos: [
                  {
                    type: "text",
                    label: "Descrição",
                    name: "description",
                    placeholder: "ex: Morada Nova",
                  },
                ],
                queryKeysParaInvalidar: [["tabelaDeCampi"]],
                substantivoParaMensagemDeRetorno: "campus",
              }}
            />
          </div>
        </Secao>
        <Secao>
          <TabelaDeCrud
            colunas={colunas}
            dados={dadosDaTabela ?? []}
            estaCarregando={isLoadingDadosDaTabela}
            ordenacaoPadrao={[{ id: "id", desc: true }]}
          />
        </Secao>
      </Secao>
    </Secao>
  );
}

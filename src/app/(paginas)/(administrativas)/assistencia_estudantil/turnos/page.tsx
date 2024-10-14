"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { createColumnHelper } from "@tanstack/react-table";
import {
  buscarTurnos,
  criarTurno,
  editarTurno,
  removerTurno,
} from "@/app/actions/assistencia_estudantil";
import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { ModalGeral } from "@/app/elementos/modulos/comuns/ModalGeral/ModalGeral";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";
import { BotaoDiv } from "@/app/elementos/basicos/BotaoDiv";

export default function NutricionistaPage() {
  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ["tabelaDeTurnos"],
    queryFn: async () => {
      const resposta = await buscarTurnos();
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
                textoTitulo="Remover turno"
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent={"Remover turno"}
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Deletar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
                tipoDeBotaoPrincipal="remover"
                textoDescricao={["Você está prestes a remover o turno abaixo:"]}
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
                  action: removerTurno,
                  campos: [
                    {
                      type: "hidden",
                      value: props.row.original.id,
                      name: "id",
                    },
                  ],
                  queryKeysParaInvalidar: [["tabelaDeTurnos"]],
                  substantivoParaMensagemDeRetorno: "turno",
                }}
              />
            </div>
            <div className="relative flex h-5 w-5 gap-x-2">
              <ModalGeral
                textoDescricao={[
                  "Modifique os campos abaixo para editar o turno.",
                ]}
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent={"Editar turno"}
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Editar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
                textoTitulo="Editar turno"
                tipoDeBotaoPrincipal="confirmar"
                formulario={{
                  action: editarTurno,
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
                      placeholder: "ex: Bacharelado em Sistemas de Informação",
                      defaultValue: props.row.original.description,
                    },
                  ],
                  queryKeysParaInvalidar: [["tabelaDeTurnos"]],
                  substantivoParaMensagemDeRetorno: "turno",
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
        <CabecalhoDeSecao titulo="Turnos" />
        <Secao className="flex flex-wrap justify-end gap-y-2">
          <div className="flex items-end gap-x-4">
            <ModalGeral
              elementoTrigger={
                <BotaoDiv
                  texto="Cadastrar turno"
                  variante="adicionar"
                  className="h-[36px] border-none px-10 py-2 leading-tight !text-branco-400 hover:!outline-preto-400 md:whitespace-nowrap"
                />
              }
              textoTitulo="Cadastrar nova turno"
              textoDescricao={[
                "Preencha os campos abaixo para cadastrar um novo turno.",
              ]}
              tipoDeBotaoPrincipal="confirmar"
              formulario={{
                action: criarTurno,
                campos: [
                  {
                    type: "text",
                    label: "Descrição",
                    name: "description",
                    placeholder: "ex: matutino, vespertino...",
                  },
                ],
                queryKeysParaInvalidar: [["tabelaDeTurnos"]],
                substantivoParaMensagemDeRetorno: "turno",
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

"use client";

import React, { useMemo } from "react";
import { parseAsString, useQueryStates } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import * as Form from "@radix-ui/react-form";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Botao } from "@/app/elementos/basicos/Botao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { createColumnHelper } from "@tanstack/react-table";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { ModalAdicionarCardapio } from "@/app/elementos/modulos/nutricionista/Cardapios/ModalAdicionarCardapio";
import { ModalRemoverCardapio } from "@/app/elementos/modulos/nutricionista/Cardapios/ModalRemoverCardapio";
import { ModalEditarCardapio } from "@/app/elementos/modulos/nutricionista/Cardapios/ModalEditarCardapio";
import {
  buscarRefeicoes,
  buscarTabelaDeCardapios,
} from "@/app/actions/nutricionista";
import { buscarRepublicas, criarRepublica } from "@/app/actions/assistencia_estudantil";
import { ModalGeral } from "@/app/elementos/modulos/comuns/ModalGeral/ModalGeral";
import { BotaoDiv } from "@/app/elementos/basicos/BotaoDiv";

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
      }),
      colunasHelper.accessor("valueRepublic", {
        cell: (props) => props.getValue(),
        header: "Valor",
      }),
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

"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  criarCurso,
  editarCurso,
  removerCurso,
} from "@/app/actions/assistencia_estudantil";
import { BotaoDiv } from "@/app/elementos/basicos/BotaoDiv";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";
import { Secao } from "@/app/elementos/basicos/Secao";
import { ModalGeral } from "@/app/elementos/modulos/comuns/ModalGeral/ModalGeral";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { IRespostaDeAction } from "@/app/interfaces/IRespostaDeAction";
import { IRespostaPaginada } from "@/app/interfaces/IRespostaPaginada";
import { IRequisicaoPaginadaQueryStates } from "@/app/interfaces/IRespostaPaginadaQueryStates";
import { TCursoSchema } from "@/app/interfaces/TCurso";
import { FetchRouteHandler } from "@/app/lib/actions/FetchRouteHandler";
import { respostaPaginadaPadrao } from "@/app/lib/actions/RespostaPaginadaPadrao";
import { createColumnHelper } from "@tanstack/react-table";
import { parseAsInteger, useQueryStates } from "nuqs";

export default function Page() {
  const [paginacao, setPaginacao] =
    useQueryStates<IRequisicaoPaginadaQueryStates>({
      last_page: parseAsInteger.withDefault(1),
      per_page: parseAsInteger.withDefault(50),
      page: parseAsInteger.withDefault(1),
      total: parseAsInteger.withDefault(50),
    });

  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ["tabelaDeCursos", paginacao],
    queryFn: async () => {
      const respostaInicial = await FetchRouteHandler.get("/course", paginacao);

      if (!respostaInicial.ok) return respostaPaginadaPadrao;

      const json = (await respostaInicial.json()) as IRespostaDeAction<
        IRespostaPaginada<unknown>
      >;
      if (!json.sucesso) return respostaPaginadaPadrao;

      const [resposta] = json.resposta;
      setPaginacao({
        last_page: resposta.last_page,
        page: resposta.current_page,
        total: resposta.total,
        per_page: resposta.per_page,
      });

      return {
        ...resposta,
        data: resposta.data.flatMap((ent) => {
          const parsed = TCursoSchema.safeParse(ent);
          return parsed.success ? parsed.data : [];
        }),
      };
    },
    initialData: respostaPaginadaPadrao,
  });

  const colunasHelper =
    createColumnHelper<(typeof dadosDaTabela.data)[number]>();

  const colunas = useMemo(
    () => [
      colunasHelper.accessor("id", {
        cell: (props) => props.getValue(),
        header: "ID",
      }),
      colunasHelper.accessor("initials", {
        cell: (props) => props.getValue(),
        header: "Iniciais",
      }),
      colunasHelper.accessor("description", {
        cell: (props) => props.getValue(),
        header: "Descrição",
        size: 550,
      }),
      colunasHelper.display({
        cell: (props) => (
          <div className="flex justify-center gap-x-2">
            <div className="relative flex h-5 w-5 gap-x-2">
              <ModalGeral
                textoTitulo="Remover curso"
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent={"Remover curso"}
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Deletar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
                tipoDeBotaoPrincipal="remover"
                textoDescricao={["Você está prestes a remover o curso abaixo:"]}
                elementoDescricao={
                  <ul className="mt-2 list-disc pl-5">
                    <li>
                      ID: <strong>{props.row.original.id}</strong>
                    </li>
                    <li>
                      Iniciais: <strong>{props.row.original.initials}</strong>
                    </li>
                    <li>
                      Descrição:{" "}
                      <strong>{props.row.original.description}</strong>
                    </li>
                  </ul>
                }
                formulario={{
                  action: removerCurso,
                  campos: [
                    {
                      type: "hidden",
                      value: props.row.original.id,
                      name: "id",
                    },
                  ],
                  queryKeysParaInvalidar: [["tabelaDeCursos"]],
                  substantivoParaMensagemDeRetorno: "curso",
                }}
              />
            </div>
            <div className="relative flex h-5 w-5 gap-x-2">
              <ModalGeral
                textoDescricao={[
                  "Modifique os campos abaixo para editar o curso.",
                ]}
                elementoTrigger={
                  <CustomTooltipWrapper
                    elementoContent={"Editar curso"}
                    elementoTrigger={
                      <div className="relative h-5 w-5 cursor-pointer">
                        <Icone.Editar className="absolute inset-0 block h-full w-full" />
                      </div>
                    }
                  />
                }
                textoTitulo="Editar curso"
                tipoDeBotaoPrincipal="confirmar"
                formulario={{
                  action: editarCurso,
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
                    {
                      type: "text",
                      label: "Iniciais",
                      name: "initials",
                      placeholder: "ex: BSI",
                      defaultValue: props.row.original.initials,
                    },
                  ],
                  queryKeysParaInvalidar: [["tabelaDeCursos"]],
                  substantivoParaMensagemDeRetorno: "curso",
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
        <CabecalhoDeSecao titulo="Cursos" />
        <Secao className="flex flex-wrap justify-end gap-y-2">
          <div className="flex items-end gap-x-4">
            <ModalGeral
              elementoTrigger={
                <BotaoDiv
                  texto="Cadastrar curso"
                  variante="adicionar"
                  className="h-[36px] border-none px-10 py-2 leading-tight text-branco-400! hover:outline-preto-400! md:whitespace-nowrap"
                />
              }
              textoTitulo="Cadastrar nova curso"
              textoDescricao={[
                "Preencha os campos abaixo para cadastrar um novo curso.",
              ]}
              tipoDeBotaoPrincipal="confirmar"
              formulario={{
                action: criarCurso,
                campos: [
                  {
                    type: "text",
                    label: "Descrição",
                    name: "description",
                    placeholder: "ex: Bacharelado em Sistemas de Informação",
                  },
                  {
                    type: "text",
                    label: "Iniciais",
                    name: "initials",
                    placeholder: "ex: BSI",
                  },
                ],
                queryKeysParaInvalidar: [["tabelaDeCursos"]],
                substantivoParaMensagemDeRetorno: "curso",
              }}
            />
          </div>
        </Secao>
        <Secao>
          <TabelaDeCrud
            colunas={colunas}
            dados={dadosDaTabela.data}
            estaCarregando={isLoadingDadosDaTabela}
            ordenacaoPadrao={[{ id: "id", desc: true }]}
            paginacaoNoServidor={{
              paginacao,
              setPaginacao,
            }}
          />
        </Secao>
      </Secao>
    </Secao>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

import {
  atualizarVencimentosEmMassa,
  buscarEstudantesPorCodigo,
} from "@/app/actions/assistencia_estudantil";
import { BadgeDeVencimento } from "@/app/elementos/basicos/BadgeDeVencimento";
import { Botao } from "@/app/elementos/basicos/Botao";
import { BotaoDiv } from "@/app/elementos/basicos/BotaoDiv";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";
import { Secao } from "@/app/elementos/basicos/Secao";
import { ModalAdicionarEstudante } from "@/app/elementos/modulos/assistencia_estudantil/Estudantes/ModalAdicionarEstudante";
import { ModalEditarEstudante } from "@/app/elementos/modulos/assistencia_estudantil/Estudantes/ModalEditarEstudante";
import { ModalRemoverEstudante } from "@/app/elementos/modulos/assistencia_estudantil/Estudantes/ModalRemoverEstudante";
import { ModalGeral } from "@/app/elementos/modulos/comuns/ModalGeral/ModalGeral";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { IRespostaDeAction } from "@/app/interfaces/IRespostaDeAction";
import { IRespostaPaginada } from "@/app/interfaces/IRespostaPaginada";
import { IRequisicaoPaginadaQueryStates } from "@/app/interfaces/IRespostaPaginadaQueryStates";
import {
  TEstudanteComCursoTurnoEUsuario,
  TEstudanteComCursoTurnoEUsuarioSchema,
} from "@/app/interfaces/TEstudante";
import { FetchRouteHandler } from "@/app/lib/actions/FetchRouteHandler";
import { respostaPaginadaPadrao } from "@/app/lib/actions/RespostaPaginadaPadrao";
import * as Form from "@radix-ui/react-form";
import { createColumnHelper } from "@tanstack/react-table";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { ModalRefeicoesAutorizadasEstudante } from "@/app/elementos/modulos/assistencia_estudantil/Estudantes/ModalRefeicoesAutorizadasEstudante";

export default function Estudantes() {
  const [pesquisa, setPesquisa] = useQueryStates(
    {
      codigo: parseAsString.withDefault(""),
    },
    {
      clearOnDefault: true,
    },
  );

  const [paginacao, setPaginacao] =
    useQueryStates<IRequisicaoPaginadaQueryStates>({
      last_page: parseAsInteger.withDefault(1),
      per_page: parseAsInteger.withDefault(50),
      page: parseAsInteger.withDefault(1),
      total: parseAsInteger.withDefault(50),
    });

  const { data: dadosDaTabela, isFetching: isLoadingDadosDaTabela } = useQuery({
    queryKey: ["tabelaDeEstudantes", paginacao.page, pesquisa.codigo],
    queryFn: async () => {
      if (pesquisa.codigo) {
        const respostaInicial: typeof respostaPaginadaPadrao & {
          data: TEstudanteComCursoTurnoEUsuario[];
        } = {
          ...respostaPaginadaPadrao,
          data: [] as TEstudanteComCursoTurnoEUsuario[],
        };
        const respostaDaBusca = await buscarEstudantesPorCodigo(
          pesquisa.codigo,
        );

        respostaDaBusca.sucesso
          ? (respostaInicial.data = respostaDaBusca.resposta.map(
              transformarEstudante,
            ) as TEstudanteComCursoTurnoEUsuario[])
          : null;

        respostaInicial.data satisfies TEstudanteComCursoTurnoEUsuario[];

        return respostaInicial;
      }

      const respostaInicial = await FetchRouteHandler.get(
        "/student",
        paginacao,
      );

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
          const parsed = TEstudanteComCursoTurnoEUsuarioSchema.safeParse(ent);
          return parsed.success ? transformarEstudante(parsed.data) : [];
        }),
      };
    },
    initialData: respostaPaginadaPadrao,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const codigo = formData.get("codigo") as string;

    setPesquisa({
      codigo,
    });
  };

  const colunasHelper = createColumnHelper<TEstudanteComCursoTurnoEUsuario>();

  const colunas = useMemo(
    () => [
      colunasHelper.accessor("id", {
        cell: (props) => props.getValue(),
        header: "ID",
        meta: { filterVariant: "range" },
      }),
      colunasHelper.accessor("mat", {
        cell: (props) => props.getValue(),
        header: "Matrícula",
      }),
      colunasHelper.accessor("name", {
        cell: (props) => props.getValue(),
        header: "Nome completo",
        size: 750,
      }),
      colunasHelper.accessor(
        (student) =>
          student.key && student.cabinet
            ? `${student.cabinet} ${student.key}`
            : "Não informado",
        {
          cell: (props) => {
            if (props.getValue() == "Não informado")
              return (
                <CustomTooltipWrapper
                  elementoTrigger={"N/I"}
                  elementoContent={"Não informado"}
                />
              );

            const [armario, chave] = props.getValue().split(" ");

            return (
              <div>
                {!armario || !chave ? (
                  <span className="w-full">N/A</span>
                ) : (
                  <>
                    <CustomTooltipWrapper
                      elementoContent={`Armário ${armario}, chave ${chave}`}
                      elementoTrigger={
                        <div className="flex flex-nowrap items-center justify-center gap-x-2 whitespace-nowrap">
                          <div className="flex items-center gap-x-1">
                            <Icone.Armario />
                            {armario}
                          </div>
                          <div className="flex items-center gap-x-1">
                            <Icone.Chave />
                            {chave}
                          </div>
                        </div>
                      }
                    />
                  </>
                )}
              </div>
            );
          },
          header: "Armário / Chave",
        },
      ),
      colunasHelper.accessor((student) => student.user?.[0]?.email ?? "", {
        cell: (props) => props.getValue(),
        header: "Email",
      }),
      colunasHelper.accessor(
        (student) =>
          `${student.course?.initials ?? ""} - ${student.course?.description ?? ""}`,
        {
          cell: (props) => (
            <CustomTooltipWrapper
              elementoContent={props.row.original.course?.description ?? ""}
              elementoTrigger={props.row.original.course?.initials ?? ""}
            />
          ),
          header: "Curso",
        },
      ),
      colunasHelper.accessor((student) => student.shift?.description ?? "", {
        cell: (props) => props.getValue(),
        header: "Turno",
      }),
      colunasHelper.accessor("dateValid", {
        cell: (props) => <BadgeDeVencimento data={props.getValue()} />,
        header: "Vencimento",
      }),
      colunasHelper.accessor("observation", {
        cell: (props) => (
          <div className="line-clamp-1 hover:line-clamp-none">
            {props.getValue()}
          </div>
        ),
        header: "Observação",
      }),
      colunasHelper.display({
        cell: (props) => {
          return (
            <div className="flex justify-center gap-x-2">
              <div className="relative h-5 w-5">
                <ModalRemoverEstudante estudante={props.row.original} />
              </div>
              <div className="relative h-5 w-5">
                <ModalEditarEstudante estudante={props.row.original} />
              </div>
              <div className="relative h-5 w-5">
                <ModalRefeicoesAutorizadasEstudante
                  estudante={props.row.original}
                />
              </div>
            </div>
          );
        },
        enableResizing: false,
        header: "Ações",
      }),
    ],
    [colunasHelper],
  );

  return (
    <Secao className="min-w-[768px] border-none">
      <Secao className="mx-auto flex max-w-[1440px] flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Estudantes" />
        <Secao className="flex flex-wrap gap-y-2">
          <div className="flex items-end gap-x-4">
            <Form.Root
              className="flex items-end gap-x-2 gap-y-2"
              onSubmit={handleSubmit}
            >
              <Form.Field name="codigo" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">Código</Form.Label>
                <Form.Control
                  type="number"
                  className="rounded px-2 py-1 outline outline-1 outline-cinza-600"
                  placeholder="Ex: 2153"
                  defaultValue={pesquisa.codigo}
                />
              </Form.Field>
              <Botao
                variante="adicionar"
                texto="Buscar"
                className="h-[36px] px-10 py-2 leading-tight"
                type="submit"
              />
            </Form.Root>
          </div>
          <div className="ml-auto flex items-end gap-x-4">
            <ModalGeral
              elementoTrigger={
                <BotaoDiv
                  texto="Atualizar vencimentos"
                  variante="editar"
                  className="h-[36px] border-none px-10 py-2 leading-tight text-branco-400! hover:outline-preto-400! md:whitespace-nowrap"
                />
              }
              tipoDeBotaoPrincipal="confirmar"
              textoTitulo="Atualização em massa"
              textoDescricao={[
                "Atualize o vencimento de vários estudantes.",
                " Informe uma data futura válida e as iniciais da matrícula.",
              ]}
              formulario={{
                action: atualizarVencimentosEmMassa,
                substantivoParaMensagemDeRetorno: "atualização",
                queryKeysParaInvalidar: [["tabelaDeEstudantes"]],
                campos: [
                  {
                    type: "text",
                    name: "mat",
                    label: "Iniciais da matrícula",
                    placeholder: "ex: 20211",
                  },
                  {
                    type: "date",
                    name: "date",
                    label: "Nova data de vencimento",
                    placeholder: "01/01/2030",
                    min: "2021-12-12",
                    max: "2100-12-30",
                  },
                ],
              }}
            />
            <ModalAdicionarEstudante />
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

function transformarEstudante(estudante: any): TEstudanteComCursoTurnoEUsuario {
  return {
    ...estudante,
    shift: estudante.shift ?? { campus_id: 1, description: "", id: 1 },
    user: estudante.user ?? [{}],
    course: estudante.course ?? { initials: "", description: "" },
  };
}

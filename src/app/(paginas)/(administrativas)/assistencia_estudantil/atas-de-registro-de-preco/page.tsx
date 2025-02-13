"use client";

import * as Form from "@radix-ui/react-form";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import React, { useMemo } from "react";

import { Botao } from "@/app/elementos/basicos/Botao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Secao } from "@/app/elementos/basicos/Secao";
import { TabelaDeCrud } from "@/app/elementos/modulos/comuns/TabelaDeCrud/TabelaDeCrud";
import { IRespostaDeAction } from "@/app/interfaces/IRespostaDeAction";
import { IRespostaPaginada } from "@/app/interfaces/IRespostaPaginada";
import { IRequisicaoPaginadaQueryStates } from "@/app/interfaces/IRespostaPaginadaQueryStates";
import { FetchRouteHandler } from "@/app/lib/actions/FetchRouteHandler";
import { respostaPaginadaPadrao } from "@/app/lib/actions/RespostaPaginadaPadrao";
import { createColumnHelper } from "@tanstack/react-table";

interface IAtaRegistroPreco {
  numero: number;
  ano: number;
  cnpj: string;
  pregao: number;
  id_sei: number | null;
}

export default function Page() {
  const [pesquisa, setPesquisa] = useQueryStates(
    {
      numero: parseAsString.withDefault(""),
      ano: parseAsString.withDefault(""),
      cnpj: parseAsString.withDefault(""),
      pregao: parseAsString.withDefault(""),
      id_sei: parseAsString.withDefault(""),
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

  const {
    data: dadosDaTabela,
    isFetching: isLoadingDadosDaTabela,
    refetch,
  } = useQuery({
    queryKey: ["atasDeRegistroDePreco", pesquisa, paginacao],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      Object.entries(pesquisa).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const respostaInicial = await FetchRouteHandler.get(
        `/atas-registro-preco?${queryParams}`,
        paginacao,
      );

      if (!respostaInicial.ok) return respostaPaginadaPadrao;

      const json = (await respostaInicial.json()) as IRespostaDeAction<
        IRespostaPaginada<IAtaRegistroPreco>
      >;
      console.log({ json });

      if (!json.sucesso) return respostaPaginadaPadrao;

      const [resposta] = json.resposta;

      setPaginacao({
        last_page: resposta.last_page,
        page: resposta.current_page,
        total: resposta.total,
        per_page: resposta.per_page,
      });

      return resposta;
    },
    initialData: respostaPaginadaPadrao,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const numero = formData.get("numero") as string;
    const ano = formData.get("ano") as string;
    const cnpj = formData.get("cnpj") as string;
    const pregao = formData.get("pregao") as string;
    const id_sei = formData.get("id_sei") as string;

    setPesquisa({ numero, ano, cnpj, pregao, id_sei });
    refetch();
  };

  const colunasHelper = createColumnHelper<IAtaRegistroPreco>();

  const colunas = useMemo(
    () => [
      colunasHelper.accessor("numero", {
        cell: (props) => props.getValue(),
        header: "Número",
      }),
      colunasHelper.accessor("ano", {
        cell: (props) => props.getValue(),
        header: "Ano",
      }),
      colunasHelper.accessor("cnpj", {
        cell: (props) => props.getValue(),
        header: "CNPJ",
      }),
      colunasHelper.accessor("pregao", {
        cell: (props) => props.getValue(),
        header: "Pregão",
      }),
      colunasHelper.accessor("id_sei", {
        cell: (props) => props.getValue() ?? "N/A",
        header: "ID SEI",
      }),
    ],
    [colunasHelper],
  );

  return (
    <Secao className="min-w-[768px] border-none">
      <Secao className="mx-auto flex max-w-[1440px] flex-col gap-y-4">
        <CabecalhoDeSecao titulo="Atas de Registro de Preço" />
        <Secao className="flex flex-wrap gap-y-2">
          <div className="flex items-end gap-x-4">
            <Form.Root
              className="flex flex-wrap items-end gap-x-2 gap-y-2"
              onSubmit={handleSubmit}
            >
              <Form.Field name="numero" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">Número</Form.Label>
                <Form.Control
                  type="text"
                  className="outline-cinza-600 rounded px-2 py-1 outline-1"
                  defaultValue={pesquisa.numero}
                  placeholder="Digite o número"
                />
              </Form.Field>
              <Form.Field name="ano" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">Ano</Form.Label>
                <Form.Control
                  type="text"
                  className="outline-cinza-600 rounded px-2 py-1 outline-1"
                  defaultValue={pesquisa.ano}
                  placeholder="Digite o ano"
                />
              </Form.Field>
              <Form.Field name="cnpj" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">CNPJ</Form.Label>
                <Form.Control
                  type="text"
                  className="outline-cinza-600 rounded px-2 py-1 outline-1"
                  defaultValue={pesquisa.cnpj}
                  placeholder="Digite o CNPJ"
                />
              </Form.Field>
              <Form.Field name="pregao" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">Pregão</Form.Label>
                <Form.Control
                  type="text"
                  className="outline-cinza-600 rounded px-2 py-1 outline-1"
                  defaultValue={pesquisa.pregao}
                  placeholder="Digite o pregão"
                />
              </Form.Field>
              <Form.Field name="id_sei" className="flex flex-col gap-y-2">
                <Form.Label className="font-bold">ID SEI</Form.Label>
                <Form.Control
                  type="text"
                  className="outline-cinza-600 rounded px-2 py-1 outline-1"
                  defaultValue={pesquisa.id_sei}
                  placeholder="Digite o ID SEI"
                />
              </Form.Field>
              <Botao
                variante="adicionar"
                texto="Buscar"
                className="h-[36px] !max-w-fit px-10 py-2 leading-tight"
                type="submit"
              />
            </Form.Root>
          </div>
        </Secao>
        <Secao>
          <TabelaDeCrud
            colunas={colunas}
            dados={dadosDaTabela.data}
            estaCarregando={isLoadingDadosDaTabela}
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

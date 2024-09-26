"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Botao } from "@elementos/basicos/Botao";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import {
  criarRelatorioDeDesperdicio,
  buscarRefeicoes,
} from "@/app/actions/nutricionista";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState, useRef } from "react";
import { SelectGeral } from "@/app/elementos/componentes/SelectGeral";
import { buscarTabelaDeCardapios } from "@/app/actions/recepcao";
import * as Form from "@radix-ui/react-form";

export const ModalAdicionarRelatorioDeDesperdicio = () => {
  const { atualizarMensagem, mensagemDeRespostaRef } = useMensagemDeResposta();
  const queryClient = useQueryClient();
  const [modalAberto, setModalAberto] = useState(false);
  const [dataDoCardapio, setDataDoCardapio] = useState<string>("");

  const dataRef = useRef<HTMLInputElement>(null);

  const { data: refeicoesDisponiveis, isFetching: isLoadingRefeicoes } =
    useQuery({
      queryKey: ["refeicoes", dataDoCardapio],
      queryFn: async () => {
        const resposta = await buscarRefeicoes();
        return resposta.sucesso ? resposta.resposta : [];
      },
      enabled: dataDoCardapio.length === 10, // Verifica se a data está completa no formato yyyy-mm-dd
      initialData: [],
    });

  const {
    data: cardapiosDisponiveis,
    isFetching: isLoadingCardapiosDisponiveis,
  } = useQuery({
    queryKey: ["tabelaDeCardapios", dataDoCardapio, refeicoesDisponiveis],
    queryFn: async () => {
      const resposta = await buscarTabelaDeCardapios({
        campus_id: 1,
        data: dataDoCardapio,
        refeicoes_disponiveis: refeicoesDisponiveis,
      });
      return resposta.sucesso ? resposta.resposta : [];
    },
    enabled: dataDoCardapio.length === 10 && refeicoesDisponiveis.length > 0, // Verifica se a data está completa no formato yyyy-mm-dd
    initialData: [],
  });

  const handleDataChange = () => {
    const data = dataRef.current?.value;

    if (data) {
      setDataDoCardapio(data);
    }
  };

  const { mutate: handleSalvar, isPending } = useMutation({
    mutationFn: (formData: FormData) => criarRelatorioDeDesperdicio(formData),
    onMutate: () => {
      atualizarMensagem({ mensagem: "Salvando relatório de desperdício..." });
    },
    onSuccess: (json) => {
      if (!json.sucesso)
        return atualizarMensagem({
          mensagem:
            json.mensagem ||
            "Erro desconhecido ao salvar relatório de desperdício.",
          sucesso: false,
        });

      atualizarMensagem({
        mensagem: "Relatório de desperdício salvo com sucesso!",
        sucesso: true,
      });

      setTimeout(() => {
        setModalAberto(false);
        queryClient.invalidateQueries({ queryKey: ["relatorioDeDesperdicio"] });
      }, 500);
    },
    onError: (error) => {
      atualizarMensagem({ mensagem: error.message, sucesso: false });
    },
  });

  return (
    <Dialog.Root open={modalAberto} onOpenChange={setModalAberto}>
      <Dialog.Trigger asChild>
        <Botao
          className="h-[36px] bg-azul-400 px-10 py-2 leading-tight"
          onClick={() => setModalAberto(true)}
          texto="Adicionar Relatório de Desperdício"
          variante="adicionar"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 rounded bg-branco-400 p-6 outline outline-1 outline-cinza-600 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Adicionar Relatório de Desperdício
          </Dialog.Title>
          <Dialog.Description>
            Preencha os campos abaixo para adicionar um novo relatório de desperdício.
          </Dialog.Description>
          <hr />
          <Form.Root
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSalvar(new FormData(e.target as HTMLFormElement));
            }}
          >
            <Form.Field name="waste_date" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="waste_date">
                Data do Desperdício
              </Form.Label>
              <Form.Control
                className="h-[34px] w-full rounded px-2 py-1 outline outline-1"
                id="waste_date"
                name="waste_date"
                type="date"
                ref={dataRef}
                onChange={handleDataChange}
                defaultValue={dataDoCardapio}
                required
              />
            </Form.Field>
            <Form.Field name="total_food_waste" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="total_food_waste">
                Total de Desperdício (kg)
              </Form.Label>
              <Form.Control
                className="h-[34px] w-full rounded px-2 py-1 outline outline-1"
                id="total_food_waste"
                name="total_food_waste"
                type="number"
                placeholder="Ex: 10"
                required
                disabled={dataDoCardapio.length !== 10}
              />
            </Form.Field>
            <SelectGeral
              label="ID do Cardápio"
              name="menu_id"
              estaCarregando={
                isLoadingCardapiosDisponiveis || isLoadingRefeicoes
              }
              opcoes={() => {
                return cardapiosDisponiveis
                  .filter((refeicao) => refeicao.menu.id != 0)
                  .map((refeicao) => ({
                    valor: refeicao.menu.id,
                    texto: `${refeicao.menu.id} - ${refeicao.meal.description} - ${refeicao.menu.description}`,
                  }));
              }}
            />
            <div className="flex flex-col items-center justify-end gap-y-2">
              <div className="text-center" ref={mensagemDeRespostaRef}></div>
              <Botao
                texto="Salvar"
                variante="adicionar"
                type="submit"
                className="mt-4"
                disabled={isPending || dataDoCardapio.length !== 10}
              />
            </div>
            <Dialog.Close asChild>
              <button
                name="Fechar"
                className="absolute right-2 top-2 inline-flex appearance-none items-center justify-center rounded-full p-[0.25em] hover:bg-cinza-400 focus:shadow-[0_0_0_2px] focus:shadow-cinza-400 focus:outline-none"
                aria-label="Fechar"
                onClick={() => setModalAberto(false)}
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
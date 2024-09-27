"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Icone from "@/app/elementos/basicos/Icone";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { Botao } from "@/app/elementos/basicos/Botao";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editarCardapio } from "@/app/actions/nutricionista";
import { TRefeicaoECardapio } from "@/app/interfaces/TRefeicao";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import * as Form from "@radix-ui/react-form";

interface ModalProps {
  refeicao_e_cardapio: TRefeicaoECardapio;
}

export const ModalEditarCardapio: React.FC<ModalProps> = ({
  refeicao_e_cardapio,
}) => {
  const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
  const queryClient = useQueryClient();

  const [modalAberto, setModalAberto] = useState(false);

  const { mutate: handleEditar, isPending } = useMutation({
    mutationFn: (formData: FormData) => editarCardapio(formData),
    mutationKey: ["editarCardapio", refeicao_e_cardapio.menu.date],
    onMutate: () => {
      atualizarMensagem({ mensagem: "Salvando cardápio..." });
    },
    onSuccess: (json) => {
      if (!json.sucesso) return atualizarMensagem(json);

      atualizarMensagem({
        mensagem: "Cardápio salvo com sucesso!",
        sucesso: true,
      });

      setTimeout(() => {
        setModalAberto(false);

        queryClient.invalidateQueries({
          queryKey: ["refeicoes", refeicao_e_cardapio.menu.date],
        });

        queryClient.invalidateQueries({
          queryKey: ["tabelaDeCardapios"],
        });
      }, 500);
    },
    onError: (error) => {
      atualizarMensagem({ mensagem: error.message, sucesso: false });
    },
  });

  return (
    <Dialog.Root open={modalAberto} onOpenChange={setModalAberto}>
      <Dialog.Trigger asChild>
        <CustomTooltipWrapper
          elementoContent="Editar cardápio"
          elementoTrigger={
            <div
              className="relative h-5 w-5 cursor-pointer"
              onClick={() => setModalAberto(true)}
            >
              <Icone.Editar className="absolute inset-0 block h-full w-full" />
            </div>
          }
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 rounded bg-branco-400 p-6 outline outline-1 outline-cinza-600 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Editar cardápio
          </Dialog.Title>
          <Dialog.Description>
            Modifique os campos abaixo para editar o cardápio.
          </Dialog.Description>
          <hr />
          <Form.Root
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleEditar(new FormData(e.target as HTMLFormElement));
            }}
          >
            <Form.Field name="description" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="description">
                Descrição
              </Form.Label>
              <Form.Control
                className="h-[34px] w-full rounded px-2 py-1 outline outline-1"
                id="description"
                placeholder="Ex: Pão com ovos + suco de acerola"
                name="description"
                defaultValue={refeicao_e_cardapio.menu.description}
              />
            </Form.Field>
            <Form.Field name="date" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="date">
                Data
              </Form.Label>
              <Form.Message>Para alterar a data, altere a busca.</Form.Message>
              <Form.Control
                readOnly
                type="date"
                id="date"
                name="date"
                className="w-full cursor-not-allowed rounded px-2 py-1 outline outline-1 disabled:bg-cinza-400"
                disabled
                defaultValue={refeicao_e_cardapio.menu.date}
              />
            </Form.Field>
            <Form.Field name="meal_id" className="hidden">
              <Form.Control
                name="meal_id"
                className="hidden"
                hidden
                value={refeicao_e_cardapio.meal.id}
                readOnly
              />
            </Form.Field>
            <div className="flex flex-col items-center justify-end gap-y-2">
              <div className="text-center" ref={mensagemDeRespostaRef}></div>
              <Botao
                texto="Salvar"
                variante="adicionar"
                type="submit"
                className="mt-4"
                disabled={isPending}
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

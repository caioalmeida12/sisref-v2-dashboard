"use client";

import { criarCardapio } from "@/app/actions/nutricionista";
import { Botao } from "@/app/elementos/basicos/Botao";
import Icone from "@/app/elementos/basicos/Icone";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { TRefeicaoECardapio } from "@/app/interfaces/TRefeicao";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";

export const ModalAdicionarCardapio = ({
  refeicao_e_cardapio,
}: {
  refeicao_e_cardapio: TRefeicaoECardapio;
}) => {
  const { atualizarMensagem, mensagemDeRespostaRef } = useMensagemDeResposta();

  const queryClient = useQueryClient();

  const [modalAberto, setModalAberto] = useState(false);

  const { mutate: handleSalvar, isPending } = useMutation({
    mutationFn: (formData: FormData) => criarCardapio(formData),
    mutationKey: ["criarCardapio", refeicao_e_cardapio.menu.date],
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
    <Dialog.Root open={modalAberto}>
      <Dialog.Trigger>
        <CustomTooltipWrapper
          elementoContent="Adicionar cardápio"
          elementoTrigger={
            <div
              className="relative h-5 w-5"
              onClick={() => setModalAberto(true)}
            >
              <Icone.Adicionar className="absolute inset-0 block h-full w-full" />
            </div>
          }
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Adicionar cardápio
          </Dialog.Title>
          <Dialog.Description>
            Preencha os campos abaixo para adicionar um novo cardápio.
          </Dialog.Description>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSalvar(new FormData(e.target as HTMLFormElement));
            }}
          >
            <fieldset className="flex flex-col justify-start gap-y-2">
              <label className="font-medium" htmlFor="description">
                Descrição
              </label>
              <input
                className="inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-4 py-2 leading-none shadow-[0_0_0_1px] shadow-preto-400 outline-none focus:shadow-[0_0_0_2px] focus:shadow-preto-400"
                id="description"
                placeholder="Ex: Pão com ovos + suco de acerola"
                name="description"
                defaultValue=""
              />
            </fieldset>
            <fieldset className="flex flex-col justify-start gap-y-2">
              <label className="font-medium" htmlFor="date">
                Data
              </label>
              <div className="rounded outline outline-1">
                <input
                  readOnly
                  type="date"
                  id="date"
                  name="date"
                  className="w-full cursor-not-allowed bg-cinza-400 px-2 py-1 text-cinza-600"
                  defaultValue={refeicao_e_cardapio.menu.date}
                />
              </div>
            </fieldset>
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
            <input
              name="meal_id"
              className="hidden"
              hidden
              value={refeicao_e_cardapio.meal.id}
              readOnly
            />
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

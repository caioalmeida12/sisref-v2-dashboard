"use client";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Icone from "@elementos//basicos/Icone";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { Botao } from "@elementos//basicos/Botao";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removerCardapio } from "@/app/actions/nutricionista";
import { TRefeicaoECardapio } from "@/app/interfaces/TRefeicao";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";

interface ModalProps {
  refeicao_e_cardapio: TRefeicaoECardapio;
}

export const ModalRemoverCardapio: React.FC<ModalProps> = ({
  refeicao_e_cardapio,
}) => {
  const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
  const queryClient = useQueryClient();

  const [modalAberto, setModalAberto] = useState(false);

  const { mutate: handleCancelar, isPending } = useMutation({
    mutationFn: () => removerCardapio({ menu_id: refeicao_e_cardapio.menu.id }),
    mutationKey: ["removerCardapio", refeicao_e_cardapio.meal.id],
    onMutate: () => {
      atualizarMensagem({ mensagem: "Cancelando cardápio..." });
    },
    onSuccess: (json) => {
      if (!json.sucesso) return atualizarMensagem(json);

      atualizarMensagem({
        mensagem: "Cardápio removido com sucesso!",
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
          elementoContent="Remover cardápio"
          elementoTrigger={
            <div
              className="relative h-5 w-5 cursor-pointer"
              onClick={() => setModalAberto(true)}
            >
              <Icone.Deletar className="absolute inset-0 block h-full w-full" />
            </div>
          }
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 rounded bg-branco-400 p-6 outline outline-1 outline-cinza-600 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Tem certeza que deseja remover este cardápio?
          </Dialog.Title>
          <Dialog.Description className="leading-normal">
            Você está prestes a remover o cardápio abaixo:
          </Dialog.Description>
          <ul className="list-disc pl-5">
            {refeicao_e_cardapio.meal.description && (
              <li>
                Refeição: <strong>{refeicao_e_cardapio.meal.description}</strong>
              </li>
            )}
            {refeicao_e_cardapio.menu.description && (
              <li>
                Cardápio: <strong>{refeicao_e_cardapio.menu.description}</strong>
              </li>
            )}
            <li>
              Data: <strong>{refeicao_e_cardapio.menu.date}</strong>
            </li>
            <li>
              ID do Menu: <strong>{refeicao_e_cardapio.menu.id}</strong>
            </li>
          </ul>
          <div ref={mensagemDeRespostaRef} className="hidden"></div>
          <Botao
            variante="remover"
            texto="Sim, desejo remover"
            disabled={isPending}
            onClick={() => handleCancelar()}
            className="mt-2"
          />
          <div className="flex justify-end gap-x-2">
            <Dialog.Close asChild>
              <Botao
                variante="editar"
                texto="Não, não desejo remover"
                onClick={() => setModalAberto(false)}
              />
            </Dialog.Close>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
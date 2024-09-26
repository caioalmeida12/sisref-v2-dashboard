"use client";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Icone from "@elementos//basicos/Icone";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { Botao } from "@elementos//basicos/Botao";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removerAgendamento } from "@/app/actions/nutricionista";
import { TAgendamento } from "@/app/interfaces/TAgendamento";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";

interface ModalProps {
  agendamento: TAgendamento;
}

export const ModalRemoverAgendamento: React.FC<ModalProps> = ({
  agendamento,
}) => {
  const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
  const queryClient = useQueryClient();

  const [modalAberto, setModalAberto] = useState(false);

  const { mutate: handleCancelar, isPending } = useMutation({
    mutationFn: () => removerAgendamento({ id: agendamento.id }),
    mutationKey: ["removerAgendamento", agendamento.id],
    onMutate: () => {
      atualizarMensagem({ mensagem: "Cancelando agendamento..." });
    },
    onSuccess: (json) => {
      if (!json.sucesso) return atualizarMensagem(json);

      atualizarMensagem({
        mensagem: "Agendamento removido com sucesso!",
        sucesso: true,
      });

      setTimeout(() => {
        setModalAberto(false);

        queryClient.invalidateQueries({
          queryKey: ["agendamentos", agendamento],
        });

        queryClient.invalidateQueries({
          queryKey: ["tabelaDeAgendamentos"],
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
          elementoContent="Remover agendamento"
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
            Tem certeza que deseja remover este agendamento?
          </Dialog.Title>
          <Dialog.Description className="leading-normal">
            Você está prestes a remover o agendamento abaixo:
          </Dialog.Description>
          <ul className="list-disc pl-5">
            <li>
              Estudante: <strong>{agendamento.student.name}</strong>
            </li>
            <li>
              Data:{" "}
              <strong>
                {DatasHelper.converterParaFormatoBrasileiro(
                  agendamento.menu.date,
                )}
              </strong>
            </li>
            {agendamento.meal.description && (
              <li>
                Refeição: <strong>{agendamento.meal.description}</strong>
              </li>
            )}
            {agendamento.menu.description && (
              <li>
                Cardápio: <strong>{agendamento.menu.description}</strong>
              </li>
            )}
            <li>
              ID do Menu: <strong>{agendamento.menu.id}</strong>
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

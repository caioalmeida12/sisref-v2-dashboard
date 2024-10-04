"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Icone from "@elementos//basicos/Icone";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { Botao } from "@elementos//basicos/Botao";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import * as Form from "@radix-ui/react-form";
import { justificarAusencia } from "@/app/actions/assistencia_estudantil"; // Import the function
import { TAgendamento } from "@/app/interfaces/TAgendamento";

interface ModalProps {
  agendamento: TAgendamento;
}

export const ModalAdicionarJustificativa: React.FC<ModalProps> = ({
  agendamento,
}) => {
  const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
  const queryClient = useQueryClient();

  const { mutate: handleJustificar, isPending } = useMutation({
    mutationFn: ({
      id,
      absenceJustification,
    }: {
      id: number;
      absenceJustification: string;
    }) => justificarAusencia(id, absenceJustification),
    mutationKey: ["justificarAusencia", agendamento.id],
    onMutate: () => {
      atualizarMensagem({ mensagem: "Justificando ausência..." });
    },
    onSuccess: (json) => {
      if (!json.sucesso) return atualizarMensagem(json);

      atualizarMensagem({
        mensagem: "Ausência justificada com sucesso!",
        sucesso: true,
      });

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["justificativasNaoProcessadas"],
        });
      }, 500);
    },
    onError: (error) => {
      atualizarMensagem({ mensagem: error.message, sucesso: false });
    },
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <CustomTooltipWrapper
          elementoContent="Adicionar justificativa"
          elementoTrigger={
            <div className="relative h-5 w-5 cursor-pointer">
              <Icone.Editar className="absolute inset-0 block h-full w-full" />
            </div>
          }
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 rounded bg-branco-400 p-6 outline outline-1 outline-cinza-600 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Adicionar justificativa
          </Dialog.Title>
          <Dialog.Description>
            Preencha os campos abaixo para justificar a ausência.
          </Dialog.Description>
          <hr />
          <Form.Root
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleJustificar({
                id: agendamento.id,
                absenceJustification: formData.get(
                  "absenceJustification",
                ) as string,
              });
            }}
          >
            <Form.Field
              name="absenceJustification"
              className="flex flex-col gap-y-1"
            >
              <Form.Label
                className="font-medium"
                htmlFor="absenceJustification"
              >
                Justificativa
              </Form.Label>
              <Form.Control
                className="h-[34px] w-full rounded px-2 py-1 outline outline-1"
                id="absenceJustification"
                placeholder="Descreva a justificativa"
                name="absenceJustification"
              />
            </Form.Field>
            <div className="flex flex-col items-center justify-end gap-y-2">
              <div className="hidden" ref={mensagemDeRespostaRef}></div>
              <Botao
                texto="Salvar"
                variante="adicionar"
                type="submit"
                className="mt-2"
                disabled={isPending}
              />
            </div>
            <Dialog.Close>
              <div
                className="absolute right-2 top-2 inline-flex appearance-none items-center justify-center rounded-full p-[0.25em] hover:bg-cinza-400 focus:shadow-[0_0_0_2px] focus:shadow-cinza-400 focus:outline-none"
                aria-label="Fechar"
              >
                <Cross2Icon />
              </div>
            </Dialog.Close>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

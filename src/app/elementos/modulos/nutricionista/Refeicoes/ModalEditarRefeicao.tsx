"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Icone from "@/app/elementos/basicos/Icone";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { Botao } from "@/app/elementos/basicos/Botao";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editarRefeicao } from "@/app/actions/nutricionista";
import { TRefeicao } from "@/app/interfaces/TRefeicao";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import * as Form from "@radix-ui/react-form";

interface ModalProps {
  refeicao: TRefeicao;
}

export const ModalEditarRefeicao: React.FC<ModalProps> = ({ refeicao }) => {
  const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
  const queryClient = useQueryClient();

  const [modalAberto, setModalAberto] = useState(false);

  const { mutate: handleEditar, isPending } = useMutation({
    mutationFn: (formData: FormData) => editarRefeicao(formData),
    mutationKey: ["editarRefeicao", refeicao?.id],
    onMutate: () => {
      atualizarMensagem({ mensagem: "Salvando refeição..." });
    },
    onSuccess: (json) => {
      if (!json.sucesso) return atualizarMensagem(json);

      atualizarMensagem({
        mensagem: "Refeição salva com sucesso!",
        sucesso: true,
      });

      setTimeout(() => {
        setModalAberto(false);

        queryClient.invalidateQueries({
          queryKey: ["tabelaDeRefeicoes"],
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
          elementoContent="Editar refeição"
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
            Editar refeição
          </Dialog.Title>
          <Dialog.Description>
            Modifique os campos abaixo para editar a refeição.
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
                defaultValue={refeicao?.description}
              />
            </Form.Field>
            <Form.Field name="timeStart" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="timeStart">
                Horário de início
              </Form.Label>
              <Form.Control
                className="w-full px-2 py-1 rounded outline outline-1"
                id="timeStart"
                name="timeStart"
                placeholder="Ex: 10:00:00"
                defaultValue={refeicao?.timeStart}
              />
            </Form.Field>
            <Form.Field name="timeEnd" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="timeEnd">
                Horário de término
              </Form.Label>
              <Form.Control
                className="w-full px-2 py-1 rounded outline outline-1"
                id="timeEnd"
                name="timeEnd"
                placeholder="Ex: 12:00:00"
                defaultValue={refeicao?.timeEnd}
              />
            </Form.Field>
            <Form.Field name="qtdTimeReservationStart" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="qtdTimeReservationStart">
                Quantas horas antes do início da refeição as reservas podem ser feitas?
              </Form.Label>
              <Form.Control
                className="w-full px-2 py-1 rounded outline outline-1"
                id="qtdTimeReservationStart"
                name="qtdTimeReservationStart"
                type="number"
                placeholder="Ex: 2 (em duas horas antes de a refeição começar estudantes podem reservar)"
                defaultValue={refeicao?.qtdTimeReservationStart}
              />
            </Form.Field>
            <Form.Field name="qtdTimeReservationEnd" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="qtdTimeReservationEnd">
                Quantas horas antes do término da refeição as reservas não podem mais ser feitas?
              </Form.Label>
              <Form.Control
                className="w-full px-2 py-1 rounded outline outline-1"
                id="qtdTimeReservationEnd"
                name="qtdTimeReservationEnd"
                type="number"
                placeholder="Ex: 2 (em duas horas antes de a refeição terminar estudantes não podem mais reservar)"
                defaultValue={refeicao?.qtdTimeReservationEnd}
              />
            </Form.Field>
            <Form.Field name="meal_id" className="hidden">
              <Form.Control
                name="meal_id"
                className="hidden"
                hidden
                value={refeicao?.id}
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
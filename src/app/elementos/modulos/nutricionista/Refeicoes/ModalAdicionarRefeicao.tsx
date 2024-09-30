"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Botao } from "@elementos//basicos/Botao";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { criarRefeicao } from "@/app/actions/nutricionista";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";

export const ModalAdicionarRefeicao = () => {
  const { atualizarMensagem, mensagemDeRespostaRef } = useMensagemDeResposta();

  const queryClient = useQueryClient();

  const [modalAberto, setModalAberto] = useState(false);

  const { mutate: handleSalvar, isPending } = useMutation({
    mutationFn: (formData: FormData) => criarRefeicao(formData),
    onMutate: () => {
      atualizarMensagem({ mensagem: "Salvando refeição..." });
    },
    onSuccess: (json) => {
      if (!json.sucesso)
        return atualizarMensagem({
          mensagem: json.mensagem || "Erro desconhecido ao salvar refeição.",
          sucesso: false,
        });

      atualizarMensagem({
        mensagem: "Refeicao salvo com sucesso!",
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
    <Dialog.Root open={modalAberto}>
      <Dialog.Trigger asChild>
        <Botao
          className="h-[36px] bg-azul-400 px-10 py-2 leading-tight"
          onClick={() => setModalAberto(true)}
          texto="Criar nova refeição"
          variante="adicionar"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Adicionar refeição
          </Dialog.Title>
          <Dialog.Description>
            Preencha os campos abaixo para adicionar um novo refeição.
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
                placeholder="Ex: Lanche da manhã"
                name="description"
              />
            </fieldset>
            <fieldset className="flex flex-col justify-start gap-y-2">
              <label className="font-medium" htmlFor="timeStart">
                Horário de início
              </label>
              <div className="rounded outline outline-1">
                <input
                  id="timeStart"
                  name="timeStart"
                  className="w-full bg-cinza-400 px-2 py-1"
                  placeholder="Ex: 10:00:00"
                />
              </div>
            </fieldset>
            <fieldset className="flex flex-col justify-start gap-y-2">
              <label className="font-medium" htmlFor="timeEnd">
                Horário de término
              </label>
              <div className="rounded outline outline-1">
                <input
                  id="timeEnd"
                  name="timeEnd"
                  className="w-full bg-cinza-400 px-2 py-1"
                  placeholder="Ex: 12:00:00"
                />
              </div>
            </fieldset>
            <fieldset className="flex flex-col justify-start gap-y-2">
              <label className="font-medium" htmlFor="qtdTimeReservationStart">
                Quantas horas antes do início da refeição as reservas podem ser
                feitas?
              </label>
              <div className="rounded outline outline-1">
                <input
                  id="qtdTimeReservationStart"
                  name="qtdTimeReservationStart"
                  type="number"
                  className="w-full bg-cinza-400 px-2 py-1"
                  placeholder="Ex: 2 (em duas horas antes de a refeição começar estudantes podem reservar)"
                />
              </div>
            </fieldset>
            <fieldset className="flex flex-col justify-start gap-y-2">
              <label className="font-medium" htmlFor="qtdTimeReservationEnd">
                Quantas horas antes do término da refeição as reservas não podem
                mais ser feitas?
              </label>
              <div className="rounded outline outline-1">
                <input
                  id="qtdTimeReservationEnd"
                  name="qtdTimeReservationEnd"
                  type="number"
                  className="w-full bg-cinza-400 px-2 py-1"
                  placeholder="Ex: 2 (em duas horas antes de a refeição terminar estudantes não podem mais reservar)"
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
            <input readOnly hidden name="campus_id" value={1} />
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

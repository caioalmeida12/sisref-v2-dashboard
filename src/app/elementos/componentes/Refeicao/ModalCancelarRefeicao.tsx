"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Botao } from "@elementos//basicos/Botao";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cancelarRefeicao } from "@/app/actions/estudante";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface ModalProps {
  meal_id: number;
  date: string;
}

export const ModalCancelarRefeicao: React.FC<ModalProps> = ({
  meal_id,
  date,
}) => {
  const refBotaoFechar = useRef<any>(null);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Botao variante="remover" texto="Cancelar" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] flex w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-4 overflow-y-auto rounded bg-branco-400 p-6 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Tem certeza que deseja cancelar a sua reserva?
          </Dialog.Title>
          <Dialog.Description className="leading-normal">
            Caso cancele sua reserva, não será possível reservar novamente.
          </Dialog.Description>
          <Cancelar
            meal_id={meal_id}
            date={date!}
            ref_botao_fechar={refBotaoFechar}
          />
          <Dialog.Close asChild>
            <div
              ref={refBotaoFechar}
              className="absolute right-2 top-2 inline-flex cursor-pointer appearance-none items-center justify-center rounded-full p-[0.25em] hover:bg-cinza-400 focus:shadow-[0_0_0_2px] focus:shadow-cinza-400 focus:outline-none"
              aria-label="Fechar"
            >
              <Cross2Icon />
            </div>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Botao variante="editar" texto="Não, não desejo cancelar" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Cancelar = ({
  meal_id,
  date,
  ref_botao_fechar,
}: {
  meal_id: number;
  date: string;
  ref_botao_fechar: React.RefObject<any>;
}) => {
  const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
  const queryClient = useQueryClient();
  const [botaoDesativado, setBotaoDesativado] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBotaoDesativado(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: () => cancelarRefeicao({ meal_id, date }),
    mutationKey: ["cancelarRefeicao", meal_id, date],
    onMutate: () => {
      atualizarMensagem({ mensagem: "Cancelando..." });
    },
    onError: (error) => {
      atualizarMensagem({ mensagem: error.message, sucesso: false });
    },
    onSuccess: (resposta) => {
      queryClient.invalidateQueries({
        queryKey: ["refeicoesPorDia"],
      });

      queryClient.invalidateQueries({
        queryKey: ["historicoDeRefeicoes"],
      });

      if (!resposta.sucesso) return atualizarMensagem(resposta);

      atualizarMensagem({
        sucesso: true,
        mensagem: resposta.resposta[0],
      });

      setTimeout(() => {
        ref_botao_fechar.current?.click();
      }, 1000);
    },
  });

  const handleCancelar = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <>
      <div ref={mensagemDeRespostaRef} className="hidden"></div>
      <Botao
        variante="remover"
        texto="Sim, desejo cancelar"
        onClick={handleCancelar}
        disabled={isPending || botaoDesativado}
      />
    </>
  );
};

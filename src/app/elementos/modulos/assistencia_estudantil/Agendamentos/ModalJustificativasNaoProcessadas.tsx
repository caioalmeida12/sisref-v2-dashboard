"use client";

import { Botao } from "@/app/elementos/basicos/Botao";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { TJustificativaNaoProcessada } from "@/app/interfaces/TJustificativaNaoProcessada";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import { BotaoDiv } from "@/app/elementos/basicos/BotaoDiv";
import { Secao } from "@/app/elementos/basicos/Secao";
import { CampoDeSecao } from "@/app/elementos/componentes/CampoDeSecao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marcarJustificativaComoProcessada } from "@/app/actions/assistencia_estudantil"; // Import the function
import { useState } from "react";
import Icone from "@/app/elementos/basicos/Icone";

export const ModalJustificativasNaoProcessadas = ({
  justificativas,
}: {
  justificativas: TJustificativaNaoProcessada[];
}) => {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<{ [key: number]: string }>({});

  const { mutate: marcarJustificativa, isPending } = useMutation({
    mutationFn: (id: number) => marcarJustificativaComoProcessada(id),
    onMutate: (id) => {
      setFeedback((prev) => ({ ...prev, [id]: "Processando..." }));
    },
    onSuccess: (json, id) => {
      if (!json.sucesso) {
        setFeedback((prev) => ({ ...prev, [id]: "Erro ao processar." }));
        return;
      }

      setFeedback((prev) => ({ ...prev, [id]: "Processada com sucesso!" }));

      queryClient.invalidateQueries({
        queryKey: ["justificativasNaoProcessadas"],
      });
    },
    onError: (_error, id) => {
      setFeedback((prev) => ({ ...prev, [id]: "Erro ao processar." }));
    },
  });

  const tooltipContent =
    justificativas.length > 1
      ? `${justificativas.length} novas solicitações de justificativa`
      : "1 nova solicitação de justificativa";

  return (
    <Dialog.Root>
      {justificativas.length > 0 ? (
        <Dialog.Trigger>
          <CustomTooltipWrapper
            elementoTrigger={
              <BotaoDiv
                className="h-[36px] border-none bg-vermelho-200 px-10 py-2 leading-tight !text-branco-400 hover:!outline-preto-400 md:whitespace-nowrap"
                texto="Ver justificativas não processadas"
                variante="remover"
              />
            }
            elementoContent={<span>{tooltipContent}</span>}
            defaultOpen={true}
          />
        </Dialog.Trigger>
      ) : (
        <Botao
          className="h-[36px] border-none px-10 py-2 leading-tight !text-branco-400 hover:!outline-preto-400 disabled:opacity-75 md:whitespace-nowrap"
          texto="Nenhuma justificativa não processada"
          variante="editar"
          disabled
        />
      )}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="max-w-[min(768px, 80vw)] fixed left-[50%] top-[50%] flex max-h-[85vh] w-fit translate-x-[-50%] translate-y-[-50%] flex-col gap-y-4 rounded bg-branco-400 p-6 outline outline-1 outline-cinza-600 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Justificativas não processadas
          </Dialog.Title>
          <Dialog.Description>
            Avalie as justificativas não processadas abaixo.
          </Dialog.Description>
          {justificativas.length === 0 && (
            <>
              <hr />
              <div className="flex items-center gap-x-2 text-verde-300">
                <Icone.Confirmar />
                Todas as justificativas foram processadas.
              </div>
            </>
          )}
          {justificativas.map((justificativa, index) => {
            return (
              <Secao
                className="flex flex-col gap-x-4 gap-y-2 md:flex-row"
                key={index}
              >
                <div className="flex w-full flex-col gap-y-2">
                  <div className="flex flex-wrap justify-between gap-x-4">
                    <CampoDeSecao
                      titulo="Nome"
                      complemento={justificativa.student.name}
                      variante="vertical"
                    />
                    <CampoDeSecao
                      titulo="Refeição e data"
                      complemento={
                        justificativa.meal.description +
                        " - " +
                        DatasHelper.converterParaFormatoBrasileiro(
                          justificativa.menu.date,
                        )
                      }
                      variante="vertical"
                    />
                  </div>
                  <CampoDeSecao
                    titulo="Justificativa"
                    complemento={justificativa.studentJustification}
                    variante="vertical"
                  />
                  <div className="flex flex-col justify-end gap-y-2">
                    <div
                      id={`mensagem-resposta-${justificativa.id}`}
                      className="text-azul-400"
                    >
                      {feedback[justificativa.id]}
                    </div>
                    <Botao
                      className="w-fit py-2 leading-tight"
                      texto="Marcar como processada"
                      variante="adicionar"
                      onClick={() => marcarJustificativa(justificativa.id)}
                      disabled={isPending}
                    />
                  </div>
                </div>
              </Secao>
            );
          })}
          <Dialog.Close asChild>
            <button
              name="Fechar"
              className="absolute right-2 top-2 inline-flex appearance-none items-center justify-center rounded-full p-[0.25em] hover:bg-cinza-400 focus:shadow-[0_0_0_2px] focus:shadow-cinza-400 focus:outline-none"
              aria-label="Fechar"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

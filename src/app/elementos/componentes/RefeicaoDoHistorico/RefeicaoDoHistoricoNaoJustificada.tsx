"use client";

import React from "react";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { justificativasPermitidas } from "@/app/interfaces/IJustificativaDeEstudante";
import classnames from "classnames";
import { SelectItemProps } from "@radix-ui/react-select";
import { Botao } from "@elementos/basicos/Botao";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import Icone from "@elementos/basicos/Icone";
import { CustomTooltipWrapper } from "@elementos/basicos/CustomTooltipWrapper";
import { justificarRefeicao } from "@/app/actions/estudante";

export const RefeicaoNaoJustificada = ({
  meal_id,
  studentJustification,
}: {
  meal_id: number;
  studentJustification: string | null;
}) => {
  const { atualizarMensagem, mensagemDeRespostaRef } = useMensagemDeResposta();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["justificarRefeicao", meal_id],
    mutationFn: (formData: FormData) =>
      justificarRefeicao({
        indiceDaJustificativa: formData.get("justificativa") as any,
        meal_id,
      }),
    onMutate: () => {
      atualizarMensagem({
        mensagem: "Justificando ausência a refeição...",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["refeicoesPorDia"],
      });

      queryClient.invalidateQueries({
        queryKey: ["historicoDeRefeicoes"],
      });

      atualizarMensagem(data);
    },
    onError: (error) => {
      atualizarMensagem({ mensagem: error.message, sucesso: false });
    },
  });

  const handleJustificarRefeicao = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    mutate(formData);
  };

  if (studentJustification) {
    return (
      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-2 text-cinza-600">
          Aguardando aprovação da justificativa.
          <CustomTooltipWrapper
            elementoContent={
              <p>Justificativa solicitada: {studentJustification}</p>
            }
            elementoTrigger={
              <div className="my-auto">
                <Icone.Informacao cor="cinza-600" />
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <form
        className="flex flex-col gap-y-4"
        aria-label="Justificar ausência a refeição"
        onSubmit={handleJustificarRefeicao}
      >
        <Select.Root name="justificativa">
          <Select.Trigger
            className="inline-flex h-8 w-full flex-1 items-center justify-between rounded-[4px] bg-branco-400 px-4 py-2 text-left shadow-[0_0_0_1px] shadow-preto-400 outline-none focus:shadow-[0_0_0_2px] focus:shadow-preto-400 disabled:cursor-not-allowed disabled:text-cinza-600"
            aria-label="Justificativa de ausência"
          >
            <Select.Value placeholder="Selecione uma opção de justificativa…" />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="overflow-hidden rounded-md border-[1px] border-preto-400 bg-branco-400 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
              <Select.ScrollUpButton className="flex cursor-default items-center justify-center bg-branco-400">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className="px-2 py-2">
                {justificativasPermitidas.length ? (
                  justificativasPermitidas.map((justificativa, index) => (
                    <SelectItem
                      key={index}
                      value={String(justificativa?.value)}
                    >
                      {justificativa?.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="null" disabled>
                    Não há refeições cadastradas.
                  </SelectItem>
                )}
              </Select.Viewport>
              <Select.ScrollDownButton className="flex cursor-default items-center justify-center bg-branco-400">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        <div className="hidden" ref={mensagemDeRespostaRef}></div>
        <Botao texto="Justificar" variante="adicionar" disabled={isPending} />
      </form>
    </>
  );
};

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, disabled, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          "relative flex cursor-pointer select-none items-center rounded px-3 py-1 data-[disabled]:pointer-events-none data-[highlighted]:bg-amarelo-200 data-[disabled]:text-cinza-600 data-[highlighted]:outline-none",
          className,
        )}
        {...props}
        ref={forwardedRef}
        disabled={disabled}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator>
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

SelectItem.displayName = "SelectItem";

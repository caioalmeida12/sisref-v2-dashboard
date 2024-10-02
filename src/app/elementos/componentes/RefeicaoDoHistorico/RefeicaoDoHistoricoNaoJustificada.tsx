"use client";

import React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { justificativasPermitidas } from "@/app/interfaces/IJustificativaDeEstudante";
import classnames from "classnames";
import { Botao } from "@elementos/basicos/Botao";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import Icone from "@elementos/basicos/Icone";
import { CustomTooltipWrapper } from "@elementos/basicos/CustomTooltipWrapper";
import { justificarRefeicao } from "@/app/actions/estudante";
import { SelectGeral } from "@/app/elementos/componentes/SelectGeral";

export const RefeicaoNaoJustificada = ({
  ticket_id,
  studentJustification,
}: {
  ticket_id: number;
  studentJustification: string | null;
}) => {
  const { atualizarMensagem, mensagemDeRespostaRef } = useMensagemDeResposta();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["justificarRefeicao", ticket_id],
    mutationFn: (formData: FormData) =>
      justificarRefeicao({
        indiceDaJustificativa: formData.get("justificativa") as any,
        ticket_id,
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
      <div className="flex flex-col gap-y-1">
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
        <SelectGeral
          label="Justificativa de ausência"
          name="justificativa"
          estaCarregando={false}
          opcoes={() => {
            return justificativasPermitidas.map((justificativa) => ({
              valor: String(justificativa?.value),
              texto: justificativa?.label,
            }));
          }}
        />
        <input type="hidden" name="ticket_id" value={ticket_id} />
        <div className="hidden" ref={mensagemDeRespostaRef}></div>
        <Botao texto="Justificar" variante="adicionar" disabled={isPending} />
      </form>
    </>
  );
};

"use client";

import {
  atualizarRefeicoesAutorizadas,
  buscarRefeicoesAutorizadasPorEstudante,
} from "@/app/actions/assistencia_estudantil";
import { buscarRefeicoes } from "@/app/actions/nutricionista";
import { Botao } from "@/app/elementos/basicos/Botao";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";
import { TBuscarRefeicoesAutorizadas } from "@/app/interfaces/TBuscarRefeicoesAutorizadas";
import { TEstudanteComCursoTurnoEUsuario } from "@/app/interfaces/TEstudante";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface ModalProps {
  estudante: TEstudanteComCursoTurnoEUsuario;
}

interface FormattedData {
  id: number;
  student_id: number;
  meal_id: number;
  comentario: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

const diasDaSemana = [
  { key: "monday", label: "Segunda-feira" },
  { key: "tuesday", label: "Terça-feira" },
  { key: "wednesday", label: "Quarta-feira" },
  { key: "thursday", label: "Quinta-feira" },
  { key: "friday", label: "Sexta-feira" },
  { key: "saturday", label: "Sábado" },
];

export const ModalRefeicoesAutorizadasEstudante: React.FC<ModalProps> = ({
  estudante,
}) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();

  const { data: nomesDasRefeicoes = [], isLoading: isLoadingRefeicoes } =
    useQuery({
      queryKey: ["tabelaDeRefeicoes"],
      queryFn: async () => {
        const resposta = await buscarRefeicoes();

        return resposta.sucesso
          ? resposta.resposta
              .sort(({ id }, { id: id2 }) => id - id2)
              .splice(0, 4)
          : [];
      },
    });

  const { control, handleSubmit, reset } = useForm<
    Record<string, boolean | string>
  >({
    defaultValues: useMemo(() => {
      return {
        comentario: "",
        ...diasDaSemana.reduce(
          (acc, dia) => {
            nomesDasRefeicoes.forEach((refeicao) => {
              acc[`${refeicao.id}-${dia.key}`] = false;
            });
            return acc;
          },
          {} as Record<string, boolean>,
        ),
      };
    }, [nomesDasRefeicoes]),
  });

  const {
    data: refeicoesAutorizadas,
    isFetching: isLoadingRefeicoesAutorizadas,
    refetch,
  } = useQuery<TBuscarRefeicoesAutorizadas[]>({
    queryKey: ["refeicoesAutorizadas", estudante.id],
    queryFn: async () => {
      const resposta = await buscarRefeicoesAutorizadasPorEstudante(
        estudante.id,
      );

      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: [],
    enabled: isModalOpen,
  });

  useEffect(() => {
    if (refeicoesAutorizadas) {
      const formValueInicial = refeicoesAutorizadas.reduce(
        (acc, refeicao) => {
          diasDaSemana.forEach((dia) => {
            acc[`${refeicao.meal_id}-${dia.key}`] =
              !!refeicao[dia.key as keyof typeof refeicao];
          });
          return acc;
        },
        {} as Record<string, any>,
      );

      const primeiroComentarioValido =
        refeicoesAutorizadas.find(
          (refeicao) =>
            refeicao.comentario && refeicao.comentario.trim() !== "",
        )?.comentario || "";

      const primeiraObservacaoValida =
        refeicoesAutorizadas.find(
          (refeicao) => refeicao.student && refeicao.student.observation,
        )?.student.observation || "";

      formValueInicial[`comentario`] =
        primeiroComentarioValido || primeiraObservacaoValida;
      reset(formValueInicial);
    }
  }, [refeicoesAutorizadas, reset]);

  useEffect(() => {
    if (isModalOpen) refetch();
  }, [isModalOpen, refetch]);

  const { mutate: handleAtualizarRefeicoes, isPending } = useMutation({
    mutationFn: async (formattedData: FormattedData[]) => {
      if (!formattedData.length)
        throw new Error("O ID da refeição não foi fornecido");

      for (const data of formattedData) {
        const resposta = await atualizarRefeicoesAutorizadas(data.id, data);

        if (!resposta.sucesso) throw new Error(resposta.mensagem);
      }

      queryClient.invalidateQueries({
        queryKey: ["refeicoesAutorizadas", estudante.id],
      });

      return { sucesso: true };
    },
    onMutate: () => {
      atualizarMensagem({ mensagem: "Atualizando refeições autorizadas..." });
    },
    onSuccess: () => {
      atualizarMensagem({
        mensagem: "Refeições autorizadas atualizadas com sucesso!",
        sucesso: true,
      });

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["refeicoesAutorizadas", estudante.id],
        });
      }, 500);
    },
    onError: (error: any) => {
      atualizarMensagem({ mensagem: error.message, sucesso: false });
    },
  });

  const onSubmit = (data: any) => {
    const formattedData: FormattedData[] = refeicoesAutorizadas.map(
      (refeicao) => {
        const mealData: FormattedData = {
          id: refeicao.id, // Use the correct id of the refeicao
          student_id: estudante.id,
          meal_id: refeicao.meal_id,
          comentario: data[`comentario`] || "",
          monday: data[`${refeicao.meal_id}-monday`] || false,
          tuesday: data[`${refeicao.meal_id}-tuesday`] || false,
          wednesday: data[`${refeicao.meal_id}-wednesday`] || false,
          thursday: data[`${refeicao.meal_id}-thursday`] || false,
          friday: data[`${refeicao.meal_id}-friday`] || false,
          saturday: data[`${refeicao.meal_id}-saturday`] || false,
        };
        return mealData;
      },
    );

    handleAtualizarRefeicoes(formattedData);
  };

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger asChild>
        <CustomTooltipWrapper
          elementoContent={"Ver refeições autorizadas"}
          elementoTrigger={
            <div
              className="relative h-5 w-5 cursor-pointer"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <Icone.RefeicoesAutorizadas className="absolute inset-0 block h-full w-full" />
            </div>
          }
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-preto-400/25 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="bg-branco-400 outline-cinza-600 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] flex max-h-[85vh] w-[95vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 rounded p-6 outline outline-1 focus:outline-hidden">
          <Dialog.Title className="m-0 text-lg font-medium">
            Refeições autorizadas para {estudante.name}
          </Dialog.Title>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Refeição
                  </th>
                  {diasDaSemana.map((dia) => (
                    <th
                      key={dia.key}
                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                    >
                      {dia.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {nomesDasRefeicoes.map((refeicao, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 not-first:text-center">
                      {refeicao.description}
                    </td>
                    {diasDaSemana.map((dia, diaIndex) => (
                      <td
                        key={diaIndex}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        <Controller
                          name={`${refeicao.id}-${dia.key}`}
                          control={control}
                          render={({ field }) => (
                            <div className="full flex justify-center">
                              <input
                                type="checkbox"
                                checked={Boolean(field.value)}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                value={String(field.value)}
                              />
                            </div>
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex flex-col gap-y-2">
              <label htmlFor="comentario">Comentário:</label>
              <Controller
                name="comentario"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <textarea
                    id="comentario"
                    {...field}
                    value={String(field.value)}
                    className="border-cinza-600 border p-2"
                  />
                )}
              />
            </div>
            <div className="mt-4 flex flex-col items-end gap-x-2 gap-y-2">
              <div className="hidden" ref={mensagemDeRespostaRef}></div>
              <div className="flex w-min gap-x-4">
                <Dialog.Close asChild>
                  <Botao variante="editar" texto="Fechar" />
                </Dialog.Close>
                <Botao
                  variante="adicionar"
                  texto="Salvar"
                  type="submit"
                  disabled={isPending}
                />
              </div>
            </div>
          </form>
          <Dialog.Close asChild>
            <div
              className="hover:bg-cinza-400 focus:shadow-cinza-400 absolute top-2 right-2 inline-flex appearance-none items-center justify-center rounded-full p-[0.25em] focus:shadow-[0_0_0_2px] focus:outline-hidden"
              aria-label="Fechar"
            >
              <Cross2Icon />
            </div>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

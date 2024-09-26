"use client";

import { buscarRefeicoes, criarAgendamento } from "@/app/actions/nutricionista";
import { Botao } from "@/app/elementos/basicos/Botao";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { ChevronDownIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const ModalAdicionarAgendamento = () => {
  const { atualizarMensagem, mensagemDeRespostaRef } = useMensagemDeResposta();

  const queryClient = useQueryClient();

  const [modalAberto, setModalAberto] = useState(false);

  const { data: nomesDasRefeicoes, isLoading: isLoadingRefeicoes } = useQuery({
    initialData: [],
    queryKey: ["refeicoes"],
    queryFn: async () => {
      const resposta = await buscarRefeicoes();

      return resposta.sucesso ? resposta.resposta : [];
    },
  });

  const { mutate: handleSalvar, isPending } = useMutation({
    mutationFn: (formData: FormData) => criarAgendamento(formData),
    onMutate: () => {
      atualizarMensagem({ mensagem: "Salvando agendamento..." });
    },
    onSuccess: (json) => {
      if (!json.sucesso)
        return atualizarMensagem({
          mensagem: json.mensagem || "Erro desconhecido ao salvar agendamento.",
          sucesso: false,
        });

      atualizarMensagem({
        mensagem: "Agendamento salvo com sucesso!",
        sucesso: true,
      });

      setTimeout(() => {
        setModalAberto(false);

        queryClient.invalidateQueries({
          queryKey: ["refeicoes"],
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
    <Dialog.Root open={modalAberto}>
      <Dialog.Trigger asChild>
        <Botao
          className="h-[36px] bg-azul-400 px-10 py-2 leading-tight"
          onClick={() => setModalAberto(true)}
          texto="Reservar para estudante"
          variante="adicionar"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Adicionar agendamento
          </Dialog.Title>
          <Dialog.Description>
            Preencha os campos abaixo para adicionar um novo agendamento.
          </Dialog.Description>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSalvar(new FormData(e.target as HTMLFormElement));
            }}
          >
            <fieldset className="flex flex-col justify-start gap-y-2">
              <label className="font-medium" htmlFor="student_id">
                Código de estudante
              </label>
              <input
                className="inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-4 py-2 leading-none shadow-[0_0_0_1px] shadow-preto-400 outline-none focus:shadow-[0_0_0_2px] focus:shadow-preto-400"
                id="student_id"
                placeholder="Ex: 2153 (código do restaurante)"
                name="student_id"
                type="number"
              />
            </fieldset>
            <fieldset className="flex flex-col justify-start gap-y-2">
              <label className="font-medium" htmlFor="date">
                Data
              </label>
              <div className="rounded outline outline-1">
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full bg-cinza-400 px-2 py-1"
                  defaultValue={DatasHelper.getDataDeHoje()}
                />
              </div>
            </fieldset>
            <fieldset className="flex flex-col justify-start gap-y-2">
              <label className="font-medium" htmlFor="meal_id">
                Refeição
              </label>
              <Select.Root name="meal_id">
                <Select.Trigger className="flex h-[34px] min-w-[250px] items-center overflow-hidden rounded px-2 py-1 text-left outline outline-1 outline-preto-400">
                  <Select.Value placeholder="Selecione a refeição desejada" />
                  <Select.Icon className="SelectIcon">
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content>
                    <Select.ScrollUpButton />
                    <Select.Viewport className="rounded bg-branco-400 px-2 py-1 outline outline-1 outline-cinza-600">
                      {!isLoadingRefeicoes &&
                        nomesDasRefeicoes &&
                        nomesDasRefeicoes.map((refeicao, index) => (
                          <Select.Item
                            value={String(refeicao?.id)}
                            className="flex items-center rounded px-2 py-1 outline-1 hover:bg-amarelo-200 hover:outline"
                            key={index}
                          >
                            <Select.ItemText>
                              {refeicao?.description}
                            </Select.ItemText>
                            <Select.ItemIndicator>
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                    <Select.Arrow />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
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
            <input name="meal_id" />
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

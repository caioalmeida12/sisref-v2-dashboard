"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Botao } from "@elementos/basicos/Botao";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { editarRelatorioDeDesperdicio } from "@/app/actions/nutricionista";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { IRelatorioDeDesperdicio } from "@/app/interfaces/IRelatorioDeDesperdicio";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";

interface ModalProps {
  relatorio: IRelatorioDeDesperdicio;
}

export const ModalEditarRelatorioDeDesperdicio: React.FC<ModalProps> = ({
  relatorio,
}) => {
  const { atualizarMensagem, mensagemDeRespostaRef } = useMensagemDeResposta();
  const queryClient = useQueryClient();
  const [modalAberto, setModalAberto] = useState(false);
  const [dataDoCardapio] = useState<string>(relatorio.menu.date);

  const { mutate: handleSalvar, isPending } = useMutation({
    mutationFn: (formData: FormData) => editarRelatorioDeDesperdicio(formData),
    onMutate: () => {
      atualizarMensagem({ mensagem: "Salvando relatório de desperdício..." });
    },
    onSuccess: (json) => {
      if (!json.sucesso)
        return atualizarMensagem({
          mensagem:
            json.mensagem ||
            "Erro desconhecido ao salvar relatório de desperdício.",
          sucesso: false,
        });

      atualizarMensagem({
        mensagem: "Relatório de desperdício salvo com sucesso!",
        sucesso: true,
      });

      setTimeout(() => {
        setModalAberto(false);
        queryClient.invalidateQueries({ queryKey: ["relatorioDeDesperdicio"] });
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
          elementoContent="Editar cardápio"
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
            Editar Relatório de Desperdício
          </Dialog.Title>
          <Dialog.Description>
            Preencha os campos abaixo para editar o relatório de desperdício.
          </Dialog.Description>
          <hr />
          <Form.Root
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSalvar(new FormData(e.target as HTMLFormElement));
            }}
          >
            <Form.Field name="date" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="date">
                Data
              </Form.Label>
              <Form.Message>
                {DatasHelper.converterParaFormatoBrasileiro(
                  relatorio.menu.date,
                )}
              </Form.Message>
              <Form.Control
                readOnly
                type="date"
                id="waste_date"
                name="waste_date"
                className="w-full cursor-not-allowed rounded px-2 py-1 outline outline-1 disabled:bg-cinza-400"
                defaultValue={relatorio.menu.date}
                hidden
              />
            </Form.Field>
            <Form.Field name="menu_id" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="menu_id">
                Descrição do cardápio
              </Form.Label>
              <Form.Message>{relatorio.menu.description}.</Form.Message>
              <Form.Control
                readOnly
                type="text"
                id="menu_id"
                name="menu_id"
                className="w-full cursor-not-allowed rounded px-2 py-1 outline outline-1 disabled:bg-cinza-400"
                defaultValue={relatorio.menu.id}
                hidden
              />
            </Form.Field>
            <Form.Field
              name="total_food_waste"
              className="flex flex-col gap-y-1"
            >
              <Form.Label className="font-medium" htmlFor="total_food_waste">
                Total de Desperdício (kg)
              </Form.Label>
              <Form.Control
                className="h-[34px] w-full rounded px-2 py-1 outline outline-1"
                id="total_food_waste"
                name="total_food_waste"
                type="number"
                placeholder="Ex: 10"
                defaultValue={relatorio.total_food_waste}
                required
                disabled={dataDoCardapio.length !== 10}
                step={0.01}
              />
            </Form.Field>
            <input type="hidden" name="id" value={relatorio.id} />
            <div className="flex flex-col items-center justify-end gap-y-2">
              <div className="text-center" ref={mensagemDeRespostaRef}></div>
              <Botao
                texto="Salvar"
                variante="adicionar"
                type="submit"
                className="mt-4"
                disabled={isPending || dataDoCardapio.length !== 10}
              />
            </div>
            <Dialog.Close asChild>
              <button
                name="Fechar"
                className="absolute right-2 top-2 inline-flex appearance-none items-center justify-center rounded-full p-[0.25em] hover:bg-cinza-400 focus:shadow-[0_0_0_2px] focus:shadow-cinza-400 focus:outline-none"
                aria-label="Fechar"
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

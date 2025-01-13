"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { Botao } from "@elementos/basicos/Botao";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Form from "@radix-ui/react-form";
import {
  buscarCursos,
  buscarTurnos,
  editarEstudante,
} from "@/app/actions/assistencia_estudantil";
import { SelectGeral } from "@/app/elementos/componentes/SelectGeral";
import { TEstudanteComCursoTurnoEUsuario } from "@/app/interfaces/TEstudante";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";

interface ModalProps {
  estudante: TEstudanteComCursoTurnoEUsuario;
}

export const ModalEditarEstudante: React.FC<ModalProps> = ({ estudante }) => {
  const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
  const [hasKey, setHasKey] = useState(estudante.hasKey);

  const handleHasKeyField = () => {
    const keyInput = document.getElementById("key") as HTMLInputElement | null;
    const cabinetInput = document.getElementById(
      "cabinet",
    ) as HTMLInputElement | null;

    setHasKey(Boolean(keyInput?.value && cabinetInput?.value));
  };

  const queryClient = useQueryClient();

  const { data: cursos, isFetching: isLoadingCursos } = useQuery({
    queryKey: ["tabelaDeCursos"],
    queryFn: async () => {
      const resposta = await buscarCursos();
      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: [],
  });

  const { data: turnos, isFetching: isLoadingTurnos } = useQuery({
    queryKey: ["tabelaDeTurnos", "semPaginacao"],
    queryFn: async () => {
      const resposta = await buscarTurnos();
      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: [],
  });

  const { mutate: handleEditar, isPending } = useMutation({
    mutationFn: (formData: FormData) => editarEstudante(formData),
    onMutate: () => {
      atualizarMensagem({ mensagem: "Salvando estudante..." });
    },
    onSuccess: (json) => {
      if (!json.sucesso) return atualizarMensagem(json);

      atualizarMensagem({
        mensagem: "Estudante editado com sucesso!",
        sucesso: true,
      });

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["tabelaDeEstudantes"],
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
          elementoContent={"Editar estudante"}
          elementoTrigger={
            <div className="relative h-5 w-5 cursor-pointer">
              <Icone.Editar className="absolute inset-0 block h-full w-full" />
            </div>
          }
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 overflow-y-auto rounded bg-branco-400 p-6 outline outline-1 outline-cinza-600 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Editar estudante
          </Dialog.Title>
          <Dialog.Description>
            Modifique os campos abaixo para editar o estudante.
          </Dialog.Description>
          <hr />
          <Form.Root
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleEditar(new FormData(e.target as HTMLFormElement));
            }}
          >
            <Form.Field name="name" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="name">
                Nome
              </Form.Label>
              <Form.Control
                className="h-[34px] w-full rounded px-2 py-1 outline outline-1"
                id="name"
                placeholder="ex: Nome Completo da Silva Junior"
                name="name"
                defaultValue={estudante.name}
              />
            </Form.Field>
            <Form.Field name="mat" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="mat">
                Matrícula
              </Form.Label>
              <Form.Control
                className="h-[34px] w-full rounded px-2 py-1 outline outline-1"
                id="mat"
                placeholder="ex: 20211035000080"
                name="mat"
                defaultValue={estudante.mat}
              />
            </Form.Field>
            <Form.Field name="email" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="email">
                Email
              </Form.Label>
              <Form.Control
                className="h-[34px] w-full rounded px-2 py-1 outline outline-1"
                id="email"
                placeholder="sobrenome.nome08@aluno.ifce.edu.br"
                name="email"
                defaultValue={estudante.user[0]?.email ?? ""}
              />
            </Form.Field>
            <div className="flex gap-x-2">
              <Form.Field name="cabinet" className="flex flex-col gap-y-1">
                <Form.Label className="font-medium" htmlFor="cabinet">
                  Armário
                </Form.Label>
                <Form.Control
                  className="h-[34px] w-full rounded px-2 py-1 outline outline-1"
                  id="cabinet"
                  placeholder="ex: 1"
                  name="cabinet"
                  defaultValue={estudante.cabinet ?? undefined}
                  onChange={handleHasKeyField}
                />
              </Form.Field>
              <Form.Field name="key" className="flex flex-col gap-y-1">
                <Form.Label className="font-medium" htmlFor="key">
                  Chave
                </Form.Label>
                <Form.Control
                  className="h-[34px] w-full rounded px-2 py-1 outline outline-1"
                  id="key"
                  placeholder="ex: 1"
                  name="key"
                  defaultValue={estudante.key ?? undefined}
                  onChange={handleHasKeyField}
                />
              </Form.Field>
            </div>
            <Form.Field name="semRegular" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="semRegular">
                Calendário do semestre
              </Form.Label>
              <div className="flex gap-x-4">
                <div className="flex gap-x-2">
                  <Form.Control
                    type="radio"
                    id="semRegular1"
                    name="semRegular"
                    value="1"
                    defaultChecked={estudante.semRegular === 1}
                  />
                  <Form.Label htmlFor="semRegular1">Regular</Form.Label>
                </div>
                <div className="flex gap-x-2">
                  <Form.Control
                    type="radio"
                    id="semRegular0"
                    name="semRegular"
                    value="0"
                    defaultChecked={estudante.semRegular === 0}
                  />
                  <Form.Label htmlFor="semRegular0">Convencional</Form.Label>
                </div>
              </div>
            </Form.Field>
            <Form.Field name="dateValid" className="flex flex-col gap-y-1">
              <Form.Label className="font-medium" htmlFor="dateValid">
                Data de validade
              </Form.Label>
              <Form.Control
                type="date"
                id="dateValid"
                name="dateValid"
                className="w-full rounded px-2 py-1 outline outline-1"
                defaultValue={estudante.dateValid}
              />
            </Form.Field>
            <SelectGeral
              label="Curso"
              name="course_id"
              opcoes={() =>
                cursos.map((curso) => ({
                  valor: curso.id,
                  texto: curso.initials + " - " + curso.description,
                }))
              }
              estaCarregando={isLoadingCursos}
              defaultValue={estudante.course.id}
            />
            <SelectGeral
              label="Turno"
              name="shift_id"
              opcoes={() =>
                turnos.map((turno) => ({
                  valor: turno.id,
                  texto: turno.description,
                }))
              }
              estaCarregando={isLoadingTurnos}
              defaultValue={estudante.shift?.id}
            />
            <input type="hidden" name="id" value={estudante.id} readOnly />
            <input
              type="hidden"
              name="hasKey"
              value={hasKey ? 1 : 0}
              readOnly
            />
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

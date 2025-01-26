"use client";

import React, { useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Form from "@radix-ui/react-form";
import { BotaoDiv } from "@/app/elementos/basicos/BotaoDiv";
import { SelectGeral } from "@/app/elementos/componentes/SelectGeral";
import classNames from "classnames";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { IRespostaDeAction } from "@/app/interfaces/IRespostaDeAction";

type CampoGenericoDoFormulario = {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string | number;
  /**Por padrão, todos os campos são required. Defina como `false` para sobrescrever esse comportamento.*/
  required?: boolean;
  className?: {
    field?: string;
    label?: string;
    control?: string;
    message?: string;
  };
};

type CampoTextoDoFormulario = CampoGenericoDoFormulario & { type: "text" };
type CampoEmailDoFormulario = CampoGenericoDoFormulario & { type: "email" };
type CampoDataDoFormulario = CampoGenericoDoFormulario & {
  type: "date";
  min: string;
  max: string;
};
type CampoNumericoDoFormulario = CampoGenericoDoFormulario & {
  type: "number";
  min: number;
  max: number;
};
type CampoSelectDoFormulario = Omit<
  CampoGenericoDoFormulario,
  "placeholder"
> & {
  type: "select";
  opcoes: () => {
    valor: string | number;
    texto: string | number;
  }[];
  estaCarregando: boolean;
};
type CampoRadioDoFormulario = CampoGenericoDoFormulario & {
  type: "radio";
  opcoes: () => {
    valor: string | number;
    texto: string | number;
  }[];
};
type CampoHiddenDoFormulario = Pick<CampoGenericoDoFormulario, "name"> & {
  type: "hidden";
  value: string | number;
};

type CampoDoFormulario =
  | CampoTextoDoFormulario
  | CampoEmailDoFormulario
  | CampoDataDoFormulario
  | CampoSelectDoFormulario
  | CampoNumericoDoFormulario
  | CampoRadioDoFormulario
  | CampoHiddenDoFormulario;

interface IModalGeralProps {
  elementoTrigger: React.ReactNode;
  textoTitulo: string;
  textoDescricao?: string[];
  elementoDescricao?: React.ReactNode;
  tipoDeBotaoPrincipal: "confirmar" | "remover";
  abertoPorPadrao?: boolean;
  desfocarBotaoPrincipal?: boolean;
  formulario: {
    action: (arg0: FormData) => Promise<IRespostaDeAction<unknown>>;
    queryKeysParaInvalidar: any[][];
    /**ex: "estudante" -> Cadastro de `estudante` feito com sucesso! */
    substantivoParaMensagemDeRetorno: string;
    campos: CampoDoFormulario[];
  };
}

export const ModalGeral = ({
  formulario,
  elementoTrigger,
  textoTitulo,
  textoDescricao,
  elementoDescricao,
  tipoDeBotaoPrincipal,
  abertoPorPadrao,
  desfocarBotaoPrincipal,
}: IModalGeralProps) => {
  const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => formulario.action(formData),
    onMutate: () => {
      atualizarMensagem({
        mensagem: `Salvando ${formulario.substantivoParaMensagemDeRetorno}...`,
      });
    },
    onSuccess: (json) => {
      if (!json.sucesso) return atualizarMensagem(json);

      atualizarMensagem({
        mensagem: `Cadastro de ${formulario.substantivoParaMensagemDeRetorno} feito com sucesso!`,
        sucesso: true,
      });

      formulario.queryKeysParaInvalidar.map((key) => {
        queryClient.invalidateQueries({
          queryKey: key,
        });
      });
    },
    onError: (error) => {
      atualizarMensagem({ mensagem: error.message, sucesso: false });
    },
  });

  return (
    <Dialog.Root defaultOpen={abertoPorPadrao}>
      <Dialog.Trigger className="contents">{elementoTrigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="min-w-[80vw]md:min-w-[450px] fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 overflow-y-auto rounded bg-branco-400 p-6 outline outline-1 outline-cinza-600 focus:outline-hidden data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            {textoTitulo}
          </Dialog.Title>
          <Dialog.Description asChild>
            <div>
              {textoDescricao?.map((linha, index) => (
                <span key={index}>{linha}</span>
              ))}
              {elementoDescricao ? elementoDescricao : null}
            </div>
          </Dialog.Description>
          <Form.Root
            className="mt-2 flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              mutate(new FormData(e.target as HTMLFormElement));
            }}
          >
            {formulario.campos.map((campo) => {
              if (campo.type == "text" || campo.type == "email") {
                return (
                  <Form.Field
                    key={campo.name}
                    name={campo.name}
                    className={classNames(
                      "flex flex-col gap-y-2",
                      campo.className?.field,
                    )}
                  >
                    <Form.Label
                      className={classNames(
                        "font-medium",
                        campo.className?.field,
                      )}
                      htmlFor={campo.name}
                    >
                      {campo.label}
                    </Form.Label>
                    <Form.Control
                      {...campo}
                      required={
                        typeof campo.required == "undefined"
                          ? true
                          : campo.required
                      }
                      className={classNames(
                        "w-full rounded px-2 py-1 outline outline-1",
                        campo.className?.control,
                      )}
                    />
                    <Form.Message
                      match={"valueMissing"}
                      className={classNames(
                        "text-vermelho-400",
                        campo.className?.message,
                      )}
                    >
                      Este campo é obrigatório.
                    </Form.Message>
                  </Form.Field>
                );
              }

              if (campo.type == "date") {
                return (
                  <Form.Field
                    key={campo.name}
                    name={campo.name}
                    className={classNames(
                      "flex flex-col gap-y-2",
                      campo.className?.field,
                    )}
                  >
                    <Form.Label
                      className={classNames(
                        "font-medium",
                        campo.className?.field,
                      )}
                      htmlFor={campo.name}
                    >
                      {campo.label}
                    </Form.Label>
                    <Form.Control
                      {...campo}
                      required={
                        typeof campo.required == "undefined"
                          ? true
                          : campo.required
                      }
                      className={classNames(
                        "w-full rounded px-2 py-1 outline outline-1",
                        campo.className?.control,
                      )}
                    />
                    <Form.Message
                      match={"valueMissing"}
                      className={classNames(
                        "text-vermelho-400",
                        campo.className?.message,
                      )}
                    >
                      Este campo é obrigatório.
                    </Form.Message>
                    <Form.Message
                      match={"rangeOverflow"}
                      className={classNames(
                        "text-vermelho-400",
                        campo.className?.message,
                      )}
                    >
                      A data selecionada está muito distante no futuro, escolha
                      uma data entre{" "}
                      {DatasHelper.converterParaFormatoBrasileiro(campo.min)} e{" "}
                      {DatasHelper.converterParaFormatoBrasileiro(campo.max)}.
                    </Form.Message>
                    <Form.Message
                      match={"rangeUnderflow"}
                      className={classNames(
                        "text-vermelho-400",
                        campo.className?.message,
                      )}
                    >
                      A data selecionada está muito distante no passado, escolha
                      uma data entre{" "}
                      {DatasHelper.converterParaFormatoBrasileiro(campo.min)} e{" "}
                      {DatasHelper.converterParaFormatoBrasileiro(campo.max)}.
                    </Form.Message>
                  </Form.Field>
                );
              }

              if (campo.type == "select") {
                return <SelectGeral key={campo.name} {...campo} />;
              }

              if (campo.type == "number") {
                return (
                  <Form.Field
                    key={campo.name}
                    name={campo.name}
                    className={classNames(
                      "flex flex-col gap-y-2",
                      campo.className?.field,
                    )}
                  >
                    <Form.Label
                      className={classNames(
                        "font-medium",
                        campo.className?.field,
                      )}
                      htmlFor={campo.name}
                    >
                      {campo.label}
                    </Form.Label>
                    <Form.Control
                      {...campo}
                      required={
                        typeof campo.required == "undefined"
                          ? true
                          : campo.required
                      }
                      className={classNames(
                        "w-full rounded px-2 py-1 outline outline-1",
                        campo.className?.control,
                      )}
                    />
                    <Form.Message
                      match={"valueMissing"}
                      className={classNames(
                        "text-vermelho-400",
                        campo.className?.message,
                      )}
                    >
                      Este campo é obrigatório.
                    </Form.Message>
                    <Form.Message
                      match={"rangeOverflow"}
                      className={classNames(
                        "text-vermelho-400",
                        campo.className?.message,
                      )}
                    >
                      O valor escolhido para o campo é muito alto. Escolha um
                      valor de {campo.min} a {campo.max}.
                    </Form.Message>
                    <Form.Message
                      match={"rangeUnderflow"}
                      className={classNames(
                        "text-vermelho-400",
                        campo.className?.message,
                      )}
                    >
                      O valor escolhido para o campo é muito baixo. Escolha um
                      valor de {campo.min} a {campo.max}.
                    </Form.Message>
                  </Form.Field>
                );
              }

              if (campo.type == "radio") {
                return <CampoRadioDoFormulario {...campo} key={campo.name} />;
              }

              if (campo.type == "hidden") {
                return (
                  <Form.Field
                    name={campo.name}
                    className="hidden"
                    key={campo.name}
                  >
                    <Form.Control
                      type="hidden"
                      value={campo.value}
                    ></Form.Control>
                  </Form.Field>
                );
              }
            })}
            <div className="flex flex-col items-center justify-end gap-y-2">
              <div
                className="hidden text-center"
                ref={mensagemDeRespostaRef}
              ></div>
              {/* O primeiro botão submit de um formulário sempre é focado, por padrão;
               Para desfocar o botão principal, basta que haja outro botão antes dele. */}
              {desfocarBotaoPrincipal ? (
                <button
                  type="submit"
                  className="fixed"
                  onKeyDown={(e) => e.preventDefault()}
                ></button>
              ) : null}
              <Form.Submit className="contents">
                {tipoDeBotaoPrincipal == "confirmar" ? (
                  <BotaoDiv
                    texto="Confirmar"
                    variante="adicionar"
                    className="mt-2"
                    disabled={isPending}
                  />
                ) : (
                  <BotaoDiv
                    texto="Remover"
                    variante="remover"
                    className="mt-2 outline-vermelho-400"
                    disabled={isPending}
                  />
                )}
              </Form.Submit>
              <Dialog.Close className="contents">
                <BotaoDiv
                  texto="Cancelar"
                  variante="remover"
                  className="border-none bg-cinza-600 text-branco-400! outline-hidden outline-offset-0! hover:outline-cinza-600! focus:outline-cinza-600!"
                  disabled={isPending}
                />
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button
                name="Fechar"
                className="absolute right-2 top-2 inline-flex appearance-none items-center justify-center rounded-full p-[0.25em] hover:bg-cinza-400 focus:shadow-[0_0_0_2px] focus:shadow-cinza-400 focus:outline-hidden"
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

const CampoRadioDoFormulario = (campo: CampoRadioDoFormulario) => {
  const opcoes = useMemo(() => campo.opcoes(), [campo.opcoes]);

  return (
    <Form.Field
      name="semRegular"
      className="flex flex-col gap-y-1"
      key={campo.name}
    >
      <Form.Label className="font-medium" htmlFor="semRegular">
        Calendário do semestre
      </Form.Label>
      <div className="flex gap-x-4">
        {opcoes.map((opcao, index) => {
          return (
            <div className="flex gap-x-2" key={index}>
              <Form.Control
                type="radio"
                id={String(opcao.texto)}
                name={campo.name}
                value={opcao.valor}
              />
              <Form.Label htmlFor={String(opcao.texto)}>
                {opcao.texto}
              </Form.Label>
            </div>
          );
        })}
      </div>
    </Form.Field>
  );
};

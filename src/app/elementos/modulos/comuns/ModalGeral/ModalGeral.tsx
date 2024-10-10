"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { Botao } from "@elementos//basicos/Botao";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Form from "@radix-ui/react-form";
import {
    buscarCursos,
    buscarTurnos,
    criarEstudante,
} from "@/app/actions/assistencia_estudantil";
import { BotaoDiv } from "@/app/elementos/basicos/BotaoDiv";
import { SelectGeral } from "@/app/elementos/componentes/SelectGeral";
import classNames from "classnames";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";


type CampoGenericoDoFormulario = {
    name: string
    label: string
    placeholder: string
    defaultValue?: string
    /**Por padrão, todos os campos são required. Defina como `false` para sobrescrever esse comportamento.*/
    required?: boolean
    className?: {
        field?: string
        label?: string
        control?: string
        message?: string
    }
}

type CampoTextoDoFormulario = CampoGenericoDoFormulario & { type: "text" }
type CampoEmailDoFormulario = CampoGenericoDoFormulario & { type: "email" }
type CampoDataDoFormulario = CampoGenericoDoFormulario & {
    type: "date"
    min: string
    max: string
}
type CampoSelectDoFormulario = CampoGenericoDoFormulario & {
    type: "select"
    opcoes: () => {
        valor: string | number;
        texto: string | number;
    }[];
    estaCarregando: boolean
}

type CampoDoFormulario = CampoTextoDoFormulario | CampoEmailDoFormulario | CampoDataDoFormulario | CampoSelectDoFormulario

interface IModalGeralProps {
    elementoTrigger: React.ReactNode
    textoTitulo: string
    textoDescricao?: string[]
    elementoConfirmar?: React.ReactNode
    elementoCancelar?: React.ReactNode
    formulario: {
        action: (arg0: FormData) => void;
        campos: CampoDoFormulario[]
    }
}

export const ModalGeral = ({
    formulario,
    elementoTrigger,
    textoTitulo,
    textoDescricao,
    elementoCancelar,
    elementoConfirmar
}: IModalGeralProps) => {
    const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                {elementoTrigger}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="fixed left-[50%] top-[50%] flex min-w-[450px] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 overflow-y-auto rounded bg-branco-400 p-6 outline outline-1 outline-cinza-600 focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="m-0 text-lg font-medium">
                        {textoTitulo}
                    </Dialog.Title>
                    <Dialog.Description>
                        {textoDescricao?.map((linha, index) => <p key={index}>{linha}</p>)}
                    </Dialog.Description>
                    <Form.Root
                        className="flex flex-col gap-y-4 mt-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            formulario.action(new FormData(e.target as HTMLFormElement));
                        }}
                    >
                        {
                            formulario.campos.map(campo => {
                                if (campo.type == "text" || campo.type == "email") {
                                    return (
                                        <Form.Field key={campo.name} name={campo.name} className={classNames("flex flex-col gap-y-2", campo.className?.field)}>
                                            <Form.Label className={classNames("font-medium", campo.className?.field)} htmlFor={campo.name} >
                                                {campo.label}
                                            </Form.Label>
                                            <Form.Control
                                                {...campo}
                                                required={typeof campo.required == "undefined" ? true : campo.required}
                                                className={classNames("w-full rounded px-2 py-1 outline outline-1", campo.className?.control)}
                                            />
                                            <Form.Message
                                                match={"valueMissing"}
                                                className={classNames("text-vermelho-400", campo.className?.message)}
                                            >
                                                Este campo é obrigatório
                                            </Form.Message>
                                        </Form.Field>
                                    )
                                }

                                if (campo.type == "date") {
                                    return (
                                        <Form.Field key={campo.name} name={campo.name} className={classNames("flex flex-col gap-y-2", campo.className?.field)}>
                                            <Form.Label className={classNames("font-medium", campo.className?.field)} htmlFor={campo.name} >
                                                {campo.label}
                                            </Form.Label>
                                            <Form.Control
                                                {...campo}
                                                required={typeof campo.required == "undefined" ? true : campo.required}
                                                className={classNames("w-full rounded px-2 py-1 outline outline-1", campo.className?.control)}

                                            />
                                            <Form.Message
                                                match={"valueMissing"}
                                                className={classNames("text-vermelho-400", campo.className?.message)}
                                            >
                                                Este campo é obrigatório
                                            </Form.Message>
                                            <Form.Message
                                                match={"rangeOverflow"}
                                                className={classNames("text-vermelho-400", campo.className?.message)}
                                            >
                                                A data selecionada está muito distante no futuro, escolha uma data entre {DatasHelper.converterParaFormatoBrasileiro(campo.min)} e {DatasHelper.converterParaFormatoBrasileiro(campo.max)}.
                                            </Form.Message>
                                            <Form.Message
                                                match={"rangeUnderflow"}
                                                className={classNames("text-vermelho-400", campo.className?.message)}
                                            >
                                                A data selecionada está muito distante no passado, escolha uma data entre {DatasHelper.converterParaFormatoBrasileiro(campo.min)} e {DatasHelper.converterParaFormatoBrasileiro(campo.max)}.
                                            </Form.Message>
                                        </Form.Field>
                                    )
                                }

                                if (campo.type == "select") {
                                    return (
                                        <SelectGeral
                                            key={campo.name}
                                            {...campo}
                                        />
                                    )
                                }
                            })
                        }
                        <div className="flex flex-col items-center justify-end gap-y-2">
                            <div className="text-center hidden" ref={mensagemDeRespostaRef}></div>
                            {elementoConfirmar ? elementoConfirmar : (
                                <Form.Submit className="contents">
                                    <BotaoDiv
                                        texto="Confirmar"
                                        variante="adicionar"
                                        className="mt-2"
                                    />
                                </Form.Submit>
                            )}
                            {elementoCancelar ? elementoConfirmar : (
                                <Dialog.Close className="contents">
                                    <BotaoDiv
                                        texto="Cancelar"
                                        variante="remover"
                                        className="bg-cinza-600 !text-branco-400 outline-none border-none hover:outline-cinza-600 focus:outline-cinza-600"
                                    />
                                </Dialog.Close>
                            )}
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

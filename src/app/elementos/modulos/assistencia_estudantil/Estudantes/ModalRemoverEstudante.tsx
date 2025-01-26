"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import useMensagemDeResposta from "@/app/lib/elementos/UseMensagemDeResposta";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removerEstudante } from "@/app/actions/assistencia_estudantil";
import { TEstudanteComCursoTurnoEUsuario } from "@/app/interfaces/TEstudante";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import { Botao } from "@/app/elementos/basicos/Botao";
import Icone from "@/app/elementos/basicos/Icone";

interface ModalProps {
    estudante: TEstudanteComCursoTurnoEUsuario;
}

export const ModalRemoverEstudante: React.FC<ModalProps> = ({ estudante }) => {
    const { mensagemDeRespostaRef, atualizarMensagem } = useMensagemDeResposta();
    const queryClient = useQueryClient();

    const { mutate: handleRemover, isPending } = useMutation({
        mutationFn: () => removerEstudante({ student_id: estudante.id }),
        onMutate: () => {
            atualizarMensagem({ mensagem: "Removendo estudante..." });
        },
        onSuccess: (json) => {
            if (!json.sucesso) return atualizarMensagem(json);

            atualizarMensagem({
                mensagem: "Estudante removido com sucesso!",
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
                    elementoContent="Remover estudante"
                    elementoTrigger={
                        <div className="relative h-5 w-5 cursor-pointer">
                            <Icone.Deletar className="absolute inset-0 block h-full w-full" />
                        </div>
                    }
                />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 rounded bg-branco-400 p-6 outline outline-1 outline-cinza-600 focus:outline-hidden data-[state=open]:animate-contentShow">
                    <Dialog.Title className="m-0 text-lg font-medium">
                        Tem certeza que deseja remover este estudante?
                    </Dialog.Title>
                    <Dialog.Description className="leading-normal">
                        Você está prestes a remover o estudante abaixo:
                    </Dialog.Description>
                    <ul className="list-disc pl-5">
                        <li>
                            Nome: <strong>{estudante.name}</strong>
                        </li>
                        <li>
                            Matrícula: <strong>{estudante.mat}</strong>
                        </li>
                        <li>
                            Email: <strong>{estudante.user[0]?.email ?? "Não informado"}</strong>
                        </li>
                        <li>
                            Curso: <strong>{estudante.course.description}</strong>
                        </li>
                        <li>
                            Turno: <strong>{estudante.shift?.description ?? "Não informado"}</strong>
                        </li>
                    </ul>
                    <div ref={mensagemDeRespostaRef} className="hidden"></div>
                    <Botao
                        variante="remover"
                        texto="Sim, desejo remover"
                        disabled={isPending}
                        onClick={() => handleRemover()}
                        className="mt-2"
                    />
                    <div className="flex justify-end gap-x-2">
                        <Dialog.Close asChild>
                            <Botao
                                variante="editar"
                                texto="Não, não desejo remover"
                            />
                        </Dialog.Close>
                    </div>
                    <Dialog.Close>
                        <div
                            className="absolute right-2 top-2 inline-flex appearance-none items-center justify-center rounded-full p-[0.25em] hover:bg-cinza-400 focus:shadow-[0_0_0_2px] focus:shadow-cinza-400 focus:outline-hidden"
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
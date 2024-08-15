"use client"

import React from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { justificativasPermitidas } from "../../interfaces/IJustificativaDeEstudante";
import classnames from "classnames";
import { SelectItemProps } from "@radix-ui/react-select";
import { Botao } from '../../basicos/Botao';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useMensagemDeResposta from '@/app/lib/elementos/UseMensagemDeResposta';
import { justificarRefeicao } from '@/app/actions/justificarRefeicao';
import Icone from '../../basicos/Icone';

export const RefeicaoNaoJustificada = ({ meal_id, studentJustification }: { meal_id: number, studentJustification: string | null }) => {
    const { atualizarMensagem, mensagemDeRespostaRef } = useMensagemDeResposta()
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationKey: ['justificarRefeicao', meal_id],
        mutationFn: (formData: FormData) => justificarRefeicao({ indiceDaJustificativa: formData.get('justificativa') as any, meal_id }),
        onMutate: () => {
            atualizarMensagem({
                mensagem: "Justificando ausência a refeição...",
            })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['refeicoesPorDia'],
            });

            queryClient.invalidateQueries({
                queryKey: ['historicoDeRefeicoes'],
            });

            atualizarMensagem(data)
        },
        onError: (error) => {
            atualizarMensagem({ mensagem: error.message, sucesso: false });
        }
    })

    const handleJustificarRefeicao = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        mutate(formData)
    }

    if (studentJustification) {
        return (
            <div className='flex flex-col gap-y-2'>
                <div className='flex gap-x-2 text-cinza-600'>
                    Aguardando aprovação da justificativa.
                    <Icone.Informacao texto={`Justificativa: ${studentJustification}`} cor='cinza-600' />
                </div>
            </div>
        )
    }

    return (
        <>
            <form className='flex flex-col gap-y-4' aria-label='Justificar ausência a refeição' onSubmit={handleJustificarRefeicao}>
                <Select.Root name='justificativa'>
                    <Select.Trigger
                        className="justify-between text-left disabled:text-cinza-600 disabled:cursor-not-allowed shadow-preto-400 focus:shadow-preto-400 inline-flex h-8 w-full flex-1 items-center rounded-[4px] px-4 py-2 shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] bg-branco-400"
                        aria-label="Justificativa de ausência"
                    >
                        <Select.Value placeholder="Selecione uma opção de justificativa…" />
                        <Select.Icon>
                            <ChevronDownIcon />
                        </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                        <Select.Content className="overflow-hidden border-preto-400 border-[1px] bg-branco-400 rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                            <Select.ScrollUpButton className="flex items-center justify-center bg-branco-400 cursor-default">
                                <ChevronUpIcon />
                            </Select.ScrollUpButton>
                            <Select.Viewport className="py-2 px-2">
                                {
                                    justificativasPermitidas.length ? justificativasPermitidas.map((justificativa, index) => (
                                        <SelectItem key={index} value={String(justificativa?.value)}>
                                            {justificativa?.label}
                                        </SelectItem>
                                    )) : <SelectItem value="null" disabled>Não há refeições cadastradas.</SelectItem>
                                }
                            </Select.Viewport>
                            <Select.ScrollDownButton className="flex items-center justify-center bg-branco-400 cursor-default">
                                <ChevronDownIcon />
                            </Select.ScrollDownButton>
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
                <div className='hidden' ref={mensagemDeRespostaRef}></div>
                <Botao texto="Justificar" variante="adicionar" disabled={isPending} />
            </form>
        </>
    )
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({ children, className, disabled, ...props }, forwardedRef) => {
        return (
            <Select.Item
                className={classnames(
                    'cursor-pointer rounded flex items-center py-1 px-3 relative select-none data-[disabled]:text-cinza-600 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-amarelo-200',
                    className
                )}
                {...props}
                ref={forwardedRef}
                disabled={disabled}
            >
                <Select.ItemText >{children}</Select.ItemText>
                <Select.ItemIndicator>
                    <CheckIcon />
                </Select.ItemIndicator>
            </Select.Item>
        );
    }
);

SelectItem.displayName = 'SelectItem';
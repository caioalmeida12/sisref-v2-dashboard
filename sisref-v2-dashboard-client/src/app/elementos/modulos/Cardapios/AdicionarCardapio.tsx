"use client"

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Botao } from '../../basicos/Botao';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { useState } from 'react';
import { DatasHelper } from '@/app/lib/elementos/DatasHelper';

const Modal = () => {
    const [data, setData] = useState({
        startDate: new Date(DatasHelper.getDataPosterior(new Date().toISOString().split('T')[0])),
        endDate: new Date(DatasHelper.getDataPosterior(new Date().toISOString().split('T')[0])),
    });

    const handleDataChange = (novaData: DateValueType) => {
        if (!novaData?.startDate || !novaData?.endDate) return;

        const corrigirData = (dateStr: string) => {
            const ontem = new Date(dateStr).toISOString().split('T')[0];
            const hoje = DatasHelper.getDataPosterior(ontem);
            return new Date(hoje);
        };

        const startDate = typeof novaData.startDate === 'string' ? corrigirData(novaData.startDate) : novaData.startDate;
        const endDate = typeof novaData.endDate === 'string' ? corrigirData(novaData.endDate) : novaData.endDate;

        setData({ startDate, endDate });
    };

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="bg-preto-400/25 data-[state=open]:animate-overlayShow fixed inset-0 " />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none ">
                <Dialog.Title className="m-0 font-medium">
                    Adicionar cardápio
                </Dialog.Title>
                <Dialog.Description className="mt-2 mb-5 leading-normal">
                    Preencha os campos abaixo para adicionar um novo cardápio.
                </Dialog.Description>
                <form className='flex flex-col gap-y-4'>
                    <fieldset className='flex flex-col gap-y-2 justify-start'>
                        <label htmlFor="description">
                            Descrição
                        </label>
                        <input
                            className="shadow-preto-400 focus:shadow-preto-400 inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-4 py-2 leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="description"
                            placeholder='Ex: Pão com ovos + suco de acerola'
                        />
                    </fieldset>
                    <fieldset className='flex flex-col gap-y-2 justify-start' >
                        <label htmlFor="date">
                            Data
                        </label>
                        <div className='outline outline-1 rounded'>
                            <Datepicker
                                primaryColor='red'
                                value={data}
                                onChange={(novaData, e) => handleDataChange(novaData)}
                                asSingle={true}
                                useRange={false}
                                placeholder='AAAA-MM-DD'
                                displayFormat='DD/MM/YYYY'
                                i18n='pt-br'
                            />
                        </div>
                    </fieldset>
                    <fieldset className='flex flex-col gap-y-2 justify-start'>
                        <label htmlFor="meal">
                            Refeição
                        </label>
                        <SelectRefeicao />
                    </fieldset>
                    <div className="mt-6 flex justify-end">
                        <Dialog.Close asChild>
                            <Botao texto='Salvar' variante='adicionar' />
                        </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                        <button
                            className="hover:bg-cinza-400 focus:shadow-cinza-400 absolute top-[10px] right-[10px] inline-flex w-6 appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                            aria-label="Close"
                        >
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </form>
            </Dialog.Content>
        </Dialog.Portal>
    )
};

const SelectRefeicao = () => (
    <Select.Root>
        <Select.Trigger
            className="shadow-preto-400 focus:shadow-preto-400 inline-flex h-8 w-full flex-1 items-center rounded-[4px] px-4 py-2 leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] bg-branco-400"
            aria-label="Refeição"
        >
            <Select.Value placeholder="Selecione uma opção…" />
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
                        <SelectItem className='py-2 hover:bg-cinza-400 focus-visible:bg-cinza-400' value="apple">Apple</SelectItem>
                        <SelectItem className='py-2 hover:bg-cinza-400 focus-visible:bg-cinza-400' value="banana">Banana</SelectItem>
                        <SelectItem className='py-2 hover:bg-cinza-400 focus-visible:bg-cinza-400' value="blueberry">Blueberry</SelectItem>
                        <SelectItem className='py-2 hover:bg-cinza-400 focus-visible:bg-cinza-400' value="grapes">Grapes</SelectItem>
                        <SelectItem className='py-2 hover:bg-cinza-400 focus-visible:bg-cinza-400' value="pineapple">Pineapple</SelectItem>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center justify-center bg-branco-400 cursor-default">
                    <ChevronDownIcon />
                </Select.ScrollDownButton>
            </Select.Content>
        </Select.Portal>
    </Select.Root>
);

interface SelectItemProps {
    children: React.ReactNode;
    value: string;
    className?: string;
    disabled?: boolean;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({ children, className, disabled, ...props }, forwardedRef) => {
        return (
            <Select.Item
                className={classnames(
                    'text-[13px] leading-none rounded-[3px] flex items-center pr-[35px] pl-6 relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
                    className
                )}
                {...props}
                ref={forwardedRef}
                disabled={disabled}
            >
                <Select.ItemText>{children}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
                    <CheckIcon />
                </Select.ItemIndicator>
            </Select.Item>
        );
    }
);

export const AdicionarCardapio = () => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <Botao variante='adicionar' texto='Adicionar Cardápio' />
        </Dialog.Trigger>
        <Modal />
    </Dialog.Root>
);

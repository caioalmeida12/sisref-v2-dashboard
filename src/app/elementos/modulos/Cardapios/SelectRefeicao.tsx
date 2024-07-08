import React from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import classnames from 'classnames';
import { IRefeicao } from '../../interfaces/IRefeicao';

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
                    'text-[13px] leading-none rounded flex items-center pr-8 pl-6 relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
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

SelectItem.displayName = 'SelectItem';

const SelectRefeicao = ({ refeicoes }: { refeicoes: IRefeicao["refeicao"][] }) => (
    <Select.Root>
        <Select.Trigger
            disabled={refeicoes.length === 0}
            className="disabled:text-cinza-600 disabled:cursor-not-allowed shadow-preto-400 focus:shadow-preto-400 inline-flex h-8 w-full flex-1 items-center rounded-[4px] px-4 py-2 leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] bg-branco-400"
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
                    {
                        refeicoes.length ? refeicoes.map((refeicao, index) => (
                            <SelectItem key={index} value={String(refeicao?.id)}>
                                {refeicao?.description}
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
);

export default SelectRefeicao;
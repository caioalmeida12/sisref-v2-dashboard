import React from "react";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import classnames from "classnames";
import { TRefeicao } from "@/app/interfaces/TRefeicao";

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
          "data-disabled:text-mauve8 data-highlighted:bg-violet9 data-highlighted:text-violet1 relative flex select-none items-center rounded pl-6 pr-8 text-[13px] leading-none data-disabled:pointer-events-none data-highlighted:outline-hidden",
          className,
        )}
        {...props}
        ref={forwardedRef}
        disabled={disabled}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

SelectItem.displayName = "SelectItem";

const SelectRefeicao = ({ refeicoes }: { refeicoes: TRefeicao[] }) => (
  <Select.Root>
    <Select.Trigger
      disabled={refeicoes.length === 0}
      className="inline-flex h-8 w-full flex-1 items-center rounded-[4px] bg-branco-400 px-4 py-2 leading-none shadow-[0_0_0_1px] shadow-preto-400 outline-hidden focus:shadow-[0_0_0_2px] focus:shadow-preto-400 disabled:cursor-not-allowed disabled:text-cinza-600"
      aria-label="Refeição"
    >
      <Select.Value placeholder="Selecione uma opção…" />
      <Select.Icon>
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="overflow-hidden rounded-md border-[1px] border-preto-400 bg-branco-400 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
        <Select.ScrollUpButton className="flex cursor-default items-center justify-center bg-branco-400">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="px-2 py-2">
          {refeicoes.length ? (
            refeicoes.map((refeicao, index) => (
              <SelectItem key={index} value={String(refeicao?.id)}>
                {refeicao?.description}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="null" disabled>
              Não há refeições cadastradas.
            </SelectItem>
          )}
        </Select.Viewport>
        <Select.ScrollDownButton className="flex cursor-default items-center justify-center bg-branco-400">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export default SelectRefeicao;

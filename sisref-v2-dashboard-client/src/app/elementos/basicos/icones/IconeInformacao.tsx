import React, { HTMLAttributes } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip';

interface IconeInformacaoProps extends HTMLAttributes<HTMLElement> {
    texto: string;
}

export const IconeInformacao = ({ texto }: IconeInformacaoProps) => {
    return (
        <div className="w-min">
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <button>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.6 4.2H5.4V3H6.6M6.6 9H5.4V5.4H6.6M6 0C5.21207 0 4.43185 0.155195 3.7039 0.456723C2.97595 0.758251 2.31451 1.20021 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.31451 10.7998 2.97595 11.2417 3.7039 11.5433C4.43185 11.8448 5.21207 12 6 12C7.5913 12 9.11742 11.3679 10.2426 10.2426C11.3679 9.11742 12 7.5913 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 0 6 0Z" fill="#C80B0F" />
                            </svg>
                        </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content className="bg-branco-400 px-3 py-2 rounded border-cinza-600 border-[1px]" sideOffset={5}>
                            <div>{texto}</div>
                            <Tooltip.Arrow className="fill-branco-400" />
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        </div>
    )
}


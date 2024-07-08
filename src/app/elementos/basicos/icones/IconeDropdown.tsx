import { CaretDownIcon } from '@radix-ui/react-icons';
import React, { HTMLAttributes } from 'react'

interface IconeDropdownProps extends HTMLAttributes<HTMLElement> {
    variante?: "sem-circulo";
}


const SemCirculo = ({ ...rest }) =>
    <CaretDownIcon
        className="relative top-[1px] transition-transform ease-in-out group-data-[state=open]:-rotate-180 stroke-branco-400 stroke-1"
        aria-hidden
        {...rest} />

export const IconeDropdown = ({ variante, ...rest }: IconeDropdownProps) => {
    if (!variante || variante === "sem-circulo") {
        return <SemCirculo {...rest} />
    }
}


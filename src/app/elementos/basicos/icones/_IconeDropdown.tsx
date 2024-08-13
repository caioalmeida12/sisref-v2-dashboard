import { CaretDownIcon } from '@radix-ui/react-icons';
import React from 'react'
import { IIconeDropdownProps } from '../../interfaces/IIcones';

const SemCirculo = ({ ...rest }) =>
    <CaretDownIcon
        className="relative top-[1px] transition-transform ease-in-out group-data-[state=open]:-rotate-180 stroke-branco-400 stroke-1"
        aria-hidden
        {...rest} />

export const _IconeDropdown = ({ variante, ...rest }: IIconeDropdownProps) => {
    if (!variante || variante === "sem-circulo") {
        return <SemCirculo {...rest} />
    }
}


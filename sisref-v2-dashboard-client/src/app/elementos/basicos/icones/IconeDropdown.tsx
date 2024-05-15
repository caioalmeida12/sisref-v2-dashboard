import { CaretDownIcon } from '@radix-ui/react-icons';
import React, { HTMLAttributes } from 'react'

interface IconeDropdownProps extends HTMLAttributes<HTMLElement> {
    variante?: "circulo" | "sem-circulo";
}

const Circulo = ({ ...rest }) => {
    return (
        <div className='relative before:absolute before:content-[""] before:bg-branco-400 before:inset-[.1em] before:rounded-full' {...rest}>
            <CaretDownIcon
                className="[&>path]:fill-vermelho-400 transition-transform group-data-[state=open]:-rotate-180"
                aria-hidden
                />
        </div>
    )
}

const SemCirculo = ({ ...rest }) =>
    <CaretDownIcon
        className="relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
        aria-hidden
        {...rest} />

export const IconeDropdown = ({ variante, ...rest }: IconeDropdownProps) => {
    if (!variante || variante === "sem-circulo") {
        return <SemCirculo {...rest} />
    }

    return <Circulo {...rest} />
}


import React, { HTMLAttributes } from 'react'

interface IconeDropdownProps extends HTMLAttributes<HTMLElement> {
    variante?: "circulo" | "sem-circulo";
}

const Circulo = ({...rest}) => {
    return (
        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' {...rest}>
            <path d="M6 0.5C6.78793 0.5 7.56815 0.655195 8.2961 0.956723C9.02405 1.25825 9.68549 1.70021 10.2426 2.25736C10.7998 2.81451 11.2417 3.47595 11.5433 4.2039C11.8448 4.93185 12 5.71207 12 6.5C12 8.0913 11.3679 9.61742 10.2426 10.7426C9.11742 11.8679 7.5913 12.5 6 12.5C5.21207 12.5 4.43185 12.3448 3.7039 12.0433C2.97595 11.7417 2.31451 11.2998 1.75736 10.7426C0.632141 9.61742 0 8.0913 0 6.5C0 4.9087 0.632141 3.38258 1.75736 2.25736C2.88258 1.13214 4.4087 0.5 6 0.5ZM3 5.3L6 8.3L9 5.3H3Z" fill="white" />
        </svg>
    )
}

const SemCirculo = ({...rest}) => {
    return (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' {...rest}>
            <path d="M9.04723 0.908325L5.22223 4.73333L1.39723 0.908325L0.222229 2.09166L5.22223 7.09166L10.2222 2.09166L9.04723 0.908325Z" fill="white" />
        </svg>
    )
}

export const IconeDropdown = ( { variante, ...rest } : IconeDropdownProps) => {
    if (!variante || variante === "sem-circulo") {
        return <SemCirculo {...rest} />
    }
    
    return <Circulo {...rest} />
}


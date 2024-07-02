import React from 'react'

import { SVGProps } from "react";

interface IconeSetaProps extends SVGProps<SVGSVGElement> {
    fill: string;
}

interface IconeSetaUnifiedProps extends SVGProps<SVGSVGElement> {
    fill: string;
    direcao: "cima" | "baixo" | "esquerda" | "direita";
}

export const IconeSetaCima = ({ fill, ...rest }: IconeSetaProps) => {
    return (
        <svg {...rest} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={`cursor-pointer ${(fill || "fill-branco-400")} rotate-90`}>
            <path d="M12 4.48485V7.51515H5.18182L7.83333 10.1667L6 12L0 6L6 0L7.83333 1.83333L5.18182 4.48485H12Z" />
        </svg>
    )
}

export const IconeSetaBaixo = ({ fill, ...rest }: IconeSetaProps) => {
    return (
        <svg {...rest} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={`cursor-pointer ${(fill || "fill-branco-400")} rotate-270`}>
            <path d="M12 4.48485V7.51515H5.18182L7.83333 10.1667L6 12L0 6L6 0L7.83333 1.83333L5.18182 4.48485H12Z" />
        </svg>
    )
}

export const IconeSetaEsquerda = ({ fill, ...rest }: IconeSetaProps) => {
    return (
        <svg {...rest} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={`cursor-pointer ${(fill || "fill-branco-400")}`}>
            <path d="M12 4.48485V7.51515H5.18182L7.83333 10.1667L6 12L0 6L6 0L7.83333 1.83333L5.18182 4.48485H12Z" />
        </svg>
    )
}

export const IconeSetaDireita = ({ fill, ...rest }: IconeSetaProps) => {
    return (
        <svg {...rest} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={`cursor-pointer rotate-180 ${(fill || "fill-branco-400")}`}>
            <path d="M12 4.48485V7.51515H5.18182L7.83333 10.1667L6 12L0 6L6 0L7.83333 1.83333L5.18182 4.48485H12Z" />
        </svg>
    )
}

export const IconeSeta = ({ fill, direcao, ...rest }: IconeSetaUnifiedProps) => {
    switch(direcao) {
        case "cima":
            return <IconeSetaCima fill={fill} {...rest}/>
        case "baixo":
            return <IconeSetaBaixo fill={fill} {...rest}/>
        case "esquerda":
            return <IconeSetaEsquerda fill={fill} {...rest}/>
        case "direita":
            return <IconeSetaDireita fill={fill} {...rest}/>
        default:
            return <IconeSetaEsquerda fill={fill} {...rest}/>
    }
}
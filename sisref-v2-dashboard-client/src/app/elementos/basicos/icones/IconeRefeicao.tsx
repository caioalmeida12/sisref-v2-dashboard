import React from 'react'

import { SVGProps } from "react";

interface IconeRefeicaoProps extends SVGProps<SVGSVGElement> {
    variante: keyof typeof iconePorVariante;
}

const LancheDaManha = () => (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.25 8.188a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1 0-1.5zm0-1.126h-1.193a4.2 4.2 0 0 0 0-1.5h1.193a.75.75 0 0 1 0 1.5m-9.307 0H.75a.75.75 0 0 1 0-1.5h1.193a4.2 4.2 0 0 0 0 1.5M3 6.313q.001.39.095.75h5.81Q9 6.703 9 6.313a3 3 0 0 0-6 0m-.315-4.11.823.823c-.401.305-.745.68-1.012 1.11l-.871-.872a.75.75 0 1 1 1.06-1.06M10.11 3l-.823.823a4.2 4.2 0 0 0-1.109-1.012l.871-.872a.75.75 0 1 1 1.061 1.06M6.75 1.062a.75.75 0 0 0-1.5 0v1.194a4.2 4.2 0 0 1 1.5 0z" fill="#000"/></svg>
)

const Almoco = () => (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6" fill="#000"/><path fillRule="evenodd" clipRule="evenodd" d="M2.75 6A.75.75 0 0 0 2 5.248h-.75a.75.75 0 1 0 0 1.5H2A.75.75 0 0 0 2.75 6m.038 2.65-.53.532a.75.75 0 1 0 1.06 1.06l.531-.53A.75.75 0 1 0 2.79 8.65m3.71 1.1a.75.75 0 0 0-.75.75v.75a.75.75 0 1 0 1.501 0v-.75a.75.75 0 0 0-.75-.75m3.711-1.098a.748.748 0 1 0-1.06 1.06l.53.53a.75.75 0 1 0 1.06-1.06zm1.539-3.403L11 5.251a.747.747 0 0 0-.749.748.75.75 0 0 0 .749.75h.75A.75.75 0 0 0 12.5 6a.75.75 0 0 0-.749-.75m-1.539-1.902.53-.53a.75.75 0 0 0 0-1.061.75.75 0 0 0-1.06 0l-.53.531a.75.75 0 0 0 0 1.06.75.75 0 0 0 1.06 0M6.5 2.249a.75.75 0 0 0 .751-.749V.75a.75.75 0 0 0-.75-.75.747.747 0 0 0-.75.749l.001.751a.747.747 0 0 0 .749.749M2.79 3.347a.747.747 0 0 0 1.059 0 .747.747 0 0 0 .001-1.06l-.53-.53a.75.75 0 0 0-1.061 0 .747.747 0 0 0-.002 1.06z" fill="#000"/></svg>
)

const LancheDaTarde = () => (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7 1a.5.5 0 0 0-.5.5v2.001l-.65-.65a.5.5 0 0 0-.707.707l1.15 1.15a1 1 0 0 0 1.413 0l1.149-1.15a.5.5 0 0 0-.707-.706L7.5 3.5v-2A.5.5 0 0 0 7 1Zm2.498 7.545.002-.04A2.5 2.5 0 0 0 7.021 6 2.5 2.5 0 0 0 4.5 8.5.5.5 0 0 0 5 9h4a.5.5 0 0 0 .498-.455Z" fill="#000" stroke="#000" strokeWidth=".25"/><path d="M1.5 9a.5.5 0 1 1 0-1H3a.5.5 0 1 1 0 1zm1.257-4.743a.5.5 0 0 0 0 .707l1.061 1.061a.5.5 0 0 0 .707-.707l-1.06-1.06a.5.5 0 0 0-.708 0ZM11 9a.5.5 0 0 1 0-1h1.5a.5.5 0 0 1 0 1zM9.475 6.025a.5.5 0 0 0 .707 0l1.06-1.06a.5.5 0 0 0-.707-.708l-1.06 1.061a.5.5 0 0 0 0 .707ZM1 10.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5Z" fill="#000" stroke="#000" strokeWidth=".25"/></svg>
)

const LancheDaNoite = () => (
    <svg width="14" height="12" viewBox="-2 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.06 6.042C4.662 3.336 5.76.954 6.378 0a6 6 0 0 0-5.79 5.994c0 .084.012.168.012.252a2.986 2.986 0 0 1 3.66 1.038A2.406 2.406 0 0 1 6 9.594c0 .912-.522 1.698-1.272 2.106a6.004 6.004 0 0 0 6.888-2.412c-1.416.138-4.188-.582-5.556-3.246" fill="#000"/><path d="M3.6 8.394h-.108a1.81 1.81 0 0 0-1.692-1.2c-.996 0-1.8.804-1.8 1.8s.804 1.8 1.8 1.8h1.8c.66 0 1.2-.54 1.2-1.2s-.54-1.2-1.2-1.2" fill="#000"/></svg>
)

const iconePorVariante = {
    "manha": LancheDaManha,
    "almoco": Almoco,
    "tarde": LancheDaTarde,
    "noite": LancheDaNoite,
} as const;

export const IconeRefeicao = ({ variante }: IconeRefeicaoProps) => {
    const Icone = iconePorVariante[variante];
    return <Icone />
}
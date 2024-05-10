import React from 'react';

import { Navbar } from '../modulos/Navbar';
import { Footer } from './Footer';
import { Botao } from '../basicos/Botao';

interface ErrorScreenProps {
    statusCode: number;
}

const messages = {
    400: 'Acesso não autorizado',
    404: 'Recurso não encontrado',
    500: 'Erro do nosso servidor',
    default: 'Ocorreu um erro',
} as const;

const variableMessages = {
    400: 'Você precisa ter permissão para acessar esta página.',
    404: 'O recurso que você buscou não foi encontrado',
    500: 'Ocorreu um erro no nosso servidor.',
    default: 'Mensagem padrão',
} as const;

const buttonVariableMessages = {
    400: 'Fazer login',
    404: 'Voltar para pagina anterior',
    500: 'Voltar para pagina anterior',
    default: 'Segunda mensagem padrão',
} as const;

export const ErrorScreen = ({ statusCode }: ErrorScreenProps) => {
    const message = messages[statusCode] || messages.default;
    const variableMessage = variableMessages[statusCode] || variableMessages.default;
    const buttonVariableMessage = buttonVariableMessages[statusCode] || buttonVariableMessages.default;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar navItems={[]} />
            <main className="flex-grow">
                <div className='flex flex-col items-center gap-64 p-12'>
                    <div className='flex flex-col items-center gap-12  '>
                        <span className='text-4xl font-bold text-verde-400 md:text-5xl'>Error <br/> <span className='text-5xl md:text-6xl'>{statusCode}</span></span>
                        <span className='text-base font-bold text-verde-400 md:text-lg'> {message}</span>
                    <div className="text-center text-base font-normal md:text-lg">{variableMessage}<br/>
                    </div>
                    </div>
                    <div className='flex flex-col items-center gap-4'>
                    <span className='text-base font-normal md:text-lg'>Caso deseje,</span>
                    <Botao texto={buttonVariableMessage} variante='adicionar'/>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
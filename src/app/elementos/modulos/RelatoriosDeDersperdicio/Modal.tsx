"use client"

import React, { useEffect, useRef, useState } from 'react';
import { EditorDeTexto } from './EditorDeTexto';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { DatasHelper } from '@/app/lib/elementos/DatasHelper';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { Botao } from '../../basicos/Botao';
import { criarRelatorioDeDesperdicio } from '@/app/actions/criarRelatorioDeDesperdicio';

const Modal = () => {
    const [data, setData] = useState({
        startDate: new Date(DatasHelper.getDataPosterior(new Date().toISOString().split('T')[0])),
        endDate: new Date(DatasHelper.getDataPosterior(new Date().toISOString().split('T')[0])),
    });

    const [texto, setTexto] = useState<Array<{}>>();

    const [salvando, setSalvando] = useState(false);

    const mensagemDeResposta = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // fetchRefeicoesParaCardapio().then((refeicoes) => setRefeicoes(refeicoes));
    }, [data]);

    const handleDataChange = (novaData: DateValueType) => {
        if (!novaData?.startDate || !novaData?.endDate) return;

        const corrigirData = (dateStr: string) => {
            const ontem = new Date(dateStr).toISOString().split('T')[0];
            const hoje = DatasHelper.getDataPosterior(ontem);
            return new Date(hoje);
        };

        const startDate = typeof novaData.startDate === 'string' ? corrigirData(novaData.startDate) : novaData.startDate;
        const endDate = typeof novaData.endDate === 'string' ? corrigirData(novaData.endDate) : novaData.endDate;

        setData({ startDate, endDate });
    };

    const handleSalvar = async (e: React.MouseEvent<HTMLButtonElement>) => {
      
        setSalvando(true);

        // Atualiza a mensagem para mostrar "Salvando..." enquanto a operação está em andamento
        mensagemDeResposta.current!.textContent = 'Salvando...';
        mensagemDeResposta.current!.classList.remove('hidden', 'text-verde-400', 'text-vermelho-400');
        mensagemDeResposta.current!.classList.add('text-azul-400');

        const formData = new FormData();
        formData.append('date', data.startDate.toISOString().split('T')[0]);
        formData.append('content', JSON.stringify(texto));

        const { sucesso, mensagem } = await criarRelatorioDeDesperdicio(formData);

        setSalvando(false);

        if (sucesso) {
            mensagemDeResposta.current!.classList.add('text-verde-400');
        } else {
            mensagemDeResposta.current!.classList.add('text-vermelho-400');
        }

        mensagemDeResposta.current!.textContent = mensagem;
    };

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="bg-preto-400/75 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] mt-8 w-[90vw] max-w-[900px] overflow-auto translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none flex flex-col gap-y-4">
                <Dialog.Title className="m-0 font-medium text-lg">
                    Adicionar relatório de desperdício
                </Dialog.Title>
                <Dialog.Description className="leading-normal">
                    Selecione uma data e elabore um relatório de desperdício.
                </Dialog.Description>
                <fieldset className='flex flex-col gap-y-2 justify-start z-[70]' >
                        <label className='font-medium' htmlFor="date">
                            Data
                        </label>
                        <div className='outline outline-1 rounded'>
                            <Datepicker
                                primaryColor='red'
                                value={data}
                                onChange={(novaData, e) => handleDataChange(novaData)}
                                asSingle={true}
                                useRange={false}
                                placeholder='AAAA-MM-DD'
                                displayFormat='DD/MM/YYYY'
                                i18n='pt-br'
                            />
                        </div>
                    </fieldset>
                <EditorDeTexto setParentState={setTexto} />
                <div className="flex justify-end flex-col items-center gap-y-2">
                        <div className="text-center" ref={mensagemDeResposta}></div>
                        <Botao texto='Salvar' variante='adicionar' type='submit' className='mt-4' disabled={salvando} onClick={handleSalvar} />
                    </div>
                <Dialog.Close asChild>
                        <button
                            className="hover:bg-cinza-400 focus:shadow-cinza-400 absolute top-2 right-2 inline-flex p-[0.25em] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                            aria-label="Fechar"
                        >
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    )
};

export default Modal;
"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { Botao } from '@elementos/basicos/Botao';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useMensagemDeResposta from '@/app/lib/elementos/UseMensagemDeResposta';
import { criarRelatorioDeDesperdicio, buscarRefeicoes, buscarTabelaDeCardapios } from '@/app/actions/nutricionista';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useState, useRef } from 'react';
import { SelectGeral } from '@/app/elementos/componentes/SelectGeral';

export const ModalAdicionarRelatorioDeDesperdicio = () => {
    const { atualizarMensagem, mensagemDeRespostaRef } = useMensagemDeResposta();
    const queryClient = useQueryClient();
    const [modalAberto, setModalAberto] = useState(false);
    const [dataDoCardapio, setDataDoCardapio] = useState<string>('');

    const dataRef = useRef<HTMLInputElement>(null);

    const { data: refeicoesDisponiveis, isFetching: isLoadingRefeicoes } = useQuery({
        queryKey: ['refeicoes', dataDoCardapio],
        queryFn: async () => {
            const resposta = await buscarRefeicoes();
            return resposta.sucesso ? resposta.resposta : [];
        },
        enabled: dataDoCardapio.length === 10, // Verifica se a data está completa no formato yyyy-mm-dd
        initialData: []
    });

    const { data: cardapiosDisponiveis, isFetching: isLoadingCardapiosDisponiveis } = useQuery({
        queryKey: ['tabelaDeCardapios', dataDoCardapio, refeicoesDisponiveis],
        queryFn: async () => {
            const resposta = await buscarTabelaDeCardapios({ campus_id: 1, data: dataDoCardapio, refeicoes_disponiveis: refeicoesDisponiveis });
            return resposta.sucesso ? resposta.resposta : [];
        },
        enabled: dataDoCardapio.length === 10 && refeicoesDisponiveis.length > 0, // Verifica se a data está completa no formato yyyy-mm-dd
        initialData: []
    });

    const handleDataChange = () => {
        const data = dataRef.current?.value;

        if (data) {
            setDataDoCardapio(data);
        }
    };

    const { mutate: handleSalvar, isPending } = useMutation({
        mutationFn: (formData: FormData) => criarRelatorioDeDesperdicio(formData),
        onMutate: () => {
            atualizarMensagem({ mensagem: 'Salvando relatório de desperdício...' });
        },
        onSuccess: (json) => {
            if (!json.sucesso) return atualizarMensagem({ mensagem: json.mensagem || 'Erro desconhecido ao salvar relatório de desperdício.', sucesso: false });

            atualizarMensagem({ mensagem: 'Relatório de desperdício salvo com sucesso!', sucesso: true });

            setTimeout(() => {
                setModalAberto(false);
                queryClient.invalidateQueries({ queryKey: ['relatorioDeDesperdicio'] });
            }, 500);
        },
        onError: (error) => {
            atualizarMensagem({ mensagem: error.message, sucesso: false });
        },
    });

    return (
        <Dialog.Root open={modalAberto}>
            <Dialog.Trigger asChild>
                <Botao className='h-[36px] px-10 bg-azul-400 leading-tight py-2' onClick={() => setModalAberto(true)} texto='Adicionar Relatório de Desperdício' variante='adicionar' />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-preto-400/25 data-[state=open]:animate-overlayShow fixed inset-0 " />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-branco-400 p-6 focus:outline-none">
                    <Dialog.Title className="m-0 font-medium text-lg">
                        Adicionar Relatório de Desperdício
                    </Dialog.Title>
                    <Dialog.Description>
                        Preencha os campos abaixo para adicionar um novo relatório de desperdício.
                    </Dialog.Description>
                    <form className='flex flex-col gap-y-4' onSubmit={(e) => { e.preventDefault(); handleSalvar(new FormData(e.target as HTMLFormElement)); }}>
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="waste_date">
                                Data do Desperdício
                            </label>
                            <input
                                className="shadow-preto-400 focus:shadow-preto-400 h-8 w-full flex-1 px-0 rounded-[4px] py-2 leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                id="waste_date"
                                name='waste_date'
                                type='date'
                                ref={dataRef}
                                onChange={handleDataChange}
                                defaultValue={dataDoCardapio}
                                required
                            />
                        </fieldset>
                        <fieldset className='flex flex-col gap-y-2 justify-start'>
                            <label className='font-medium' htmlFor="total_food_waste">
                                Total de Desperdício (kg)
                            </label>
                            <input
                                className="disabled:cursor-not-allowed shadow-preto-400 focus:shadow-preto-400 inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] py-2 leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                id="total_food_waste"
                                name='total_food_waste'
                                type='number'
                                placeholder='Ex: 10'
                                required
                                disabled={dataDoCardapio.length !== 10}
                            />
                        </fieldset>
                        <SelectGeral label='ID do Cardápio' name='menu_id' estaCarregando={isLoadingCardapiosDisponiveis || isLoadingRefeicoes}
                            opcoes={() => {
                                return cardapiosDisponiveis
                                    .filter((refeicao) => refeicao.menu.id != 0)
                                    .map((refeicao) => ({
                                        valor: refeicao.menu.id,
                                        texto: `${refeicao.menu.id} - ${refeicao.meal.description} - ${refeicao.menu.description}`,
                                    }));
                            }} />
                        <div className="flex justify-end flex-col items-center gap-y-2">
                            <div className="text-center" ref={mensagemDeRespostaRef}></div>
                            <Botao texto='Salvar' variante='adicionar' type='submit' className='mt-4' disabled={isPending || dataDoCardapio.length !== 10} />
                        </div>
                        <Dialog.Close asChild>
                            <button
                                name='Fechar'
                                className="hover:bg-cinza-400 focus:shadow-cinza-400 absolute top-2 right-2 inline-flex p-[0.25em] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                                aria-label="Fechar"
                                onClick={() => setModalAberto(false)}
                            >
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
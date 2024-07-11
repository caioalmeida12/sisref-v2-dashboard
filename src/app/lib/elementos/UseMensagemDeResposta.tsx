import { useState, useRef } from 'react';

const useMensagemDeResposta = () => {
    const [carregando, setCarregando] = useState(false);
    const mensagemDeRespostaRef = useRef<HTMLDivElement | null>(null);

    const atualizarMensagem = (resposta: { sucesso: boolean; mensagem: string } | { mensagem: string }) => {
        setCarregando(true);

        mensagemDeRespostaRef.current?.classList.remove('text-verde-300', 'text-vermelho-400', 'text-azul-400', 'hidden');

        if (carregando || !("sucesso" in resposta)) {
            mensagemDeRespostaRef.current?.classList.add('text-azul-400');
            mensagemDeRespostaRef.current!.textContent = resposta.mensagem;
            return;
        }

        if (resposta.sucesso) {
            mensagemDeRespostaRef.current!.textContent = resposta.mensagem;
            mensagemDeRespostaRef.current!.classList.remove('text-vermelho-400', 'text-azul-400');
            mensagemDeRespostaRef.current!.classList.add('text-verde-300');
        } else {
            mensagemDeRespostaRef.current!.textContent = resposta.mensagem;
            mensagemDeRespostaRef.current!.classList.remove('text-verde-300', 'text-azul-400');
            mensagemDeRespostaRef.current!.classList.add('text-vermelho-400');
        }
        setCarregando(false);
    };

    return { carregando, mensagemDeRespostaRef, atualizarMensagem };
};

export default useMensagemDeResposta;
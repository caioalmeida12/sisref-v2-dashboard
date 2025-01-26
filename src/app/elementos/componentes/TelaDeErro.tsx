import React from "react";

import { Navbar } from "../modulos/comuns/Navbar";
import { Footer } from "./Footer";
import { Botao } from "@elementos/basicos/Botao";

type TelaDeErroProps = {
  statusCode:
    | keyof typeof mensagensErro
    | keyof typeof mensagensDetalhadas
    | keyof typeof mensagensBotao;
};

const mensagensErro = {
  400: "Acesso não autorizado",
  404: "Recurso não encontrado",
  500: "Erro do nosso servidor",
  default: "Erro desconhecido",
} as const;

const mensagensDetalhadas = {
  400: "Você precisa ter permissão para acessar esta página.",
  404: "O recurso que você buscou não foi encontrado",
  500: "Ocorreu um erro no nosso servidor.",
  default: "Ocorreu um erro desconhecido.",
} as const;

const mensagensBotao = {
  400: "Fazer login",
  404: "Voltar para pagina anterior",
  500: "Voltar para pagina anterior",
  default: "Voltar para pagina anterior",
} as const;

export const TelaDeErro = ({ statusCode }: TelaDeErroProps) => {
  const mensagem = mensagensErro[statusCode] || mensagensErro.default;
  const mensagemDetalhada =
    mensagensDetalhadas[statusCode] || mensagensDetalhadas.default;
  const mensagemBotao = mensagensBotao[statusCode] || mensagensBotao.default;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar navItems={[]} />
      <main className="grow">
        <div className="flex flex-col items-center gap-64 p-12">
          <div className="flex flex-col items-center gap-12">
            <span className="text-4xl font-bold text-verde-400 md:text-5xl">
              Erro <br />{" "}
              <span className="text-5xl md:text-6xl">{statusCode}</span>
            </span>
            <span className="text-base font-bold text-verde-400 md:text-lg">
              {" "}
              {mensagem}
            </span>
            <div className="text-center text-base font-normal md:text-lg">
              {mensagemDetalhada}
              <br />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <span className="text-base font-normal md:text-lg">
              Caso deseje,
            </span>
            <Botao texto={mensagemBotao} variante="adicionar" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

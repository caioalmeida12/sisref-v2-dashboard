"use client";

import React from "react";

import { useEffect, useState } from "react";
import { Botao } from "@elementos/basicos/Botao";
import { CabecalhoDeSecao } from "@elementos/basicos/CabecalhoDeSecao";
import { Secao } from "@elementos/basicos/Secao";
import { TextoDescritivo } from "./TextoDescritivo";
import { RestricaoAlimentar } from "@elementos/basicos/RestricaoAlimentar";
import Skeleton from "react-loading-skeleton";

const TEMPO_DE_CARREGAMENTO = 2000;

export const RestricoesAlimentares = ({
  forcarExibicao = false,
}: {
  forcarExibicao?: boolean;
}) => {
  const [restricoes, setRestricoes] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRestricoes(["Glúten", "Lactose", "Frutos do mar"]);

      setCarregando(false);
    }, TEMPO_DE_CARREGAMENTO);
  }, []);

  const handleAdicionarRestricao = () => {
    const restricao = prompt(
      "Digite a restrição alimentar que deseja adicionar",
    );
    if (!restricao) return;

    setRestricoes([...restricoes, restricao]);
  };

  const handleRemoverRestricao = (e: React.MouseEvent) => {
    const restricao =
      e.currentTarget?.parentElement?.previousSibling?.textContent;
    if (!restricao) return;

    setRestricoes(restricoes.filter((item) => item !== restricao));
  };

  return (
    <div
      className={`${forcarExibicao ? "flex" : "hidden"} flex-col gap-4 lg:flex`}
    >
      <TextoDescritivo />
      <Secao className="flex flex-col gap-4">
        <CabecalhoDeSecao titulo="Suas restrições alimentares" />
        {carregando ? (
          <LoadingSkeletons />
        ) : (
          restricoes.map((item, index) => (
            <RestricaoAlimentar
              key={index}
              texto={item}
              onRemove={handleRemoverRestricao}
            />
          ))
        )}
        <Botao
          texto="Adicionar"
          variante="adicionar"
          onClick={handleAdicionarRestricao}
        />
      </Secao>
    </div>
  );
};

const LoadingSkeletons = () => {
  return Array.from({ length: 3 }).map((_, index) => (
    <Skeleton key={index} height={58} />
  ));
};

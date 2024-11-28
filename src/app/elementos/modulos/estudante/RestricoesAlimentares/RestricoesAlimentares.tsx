"use client";

import React from "react";

import { CabecalhoDeSecao } from "@elementos/basicos/CabecalhoDeSecao";
import { RestricaoAlimentar } from "@elementos/basicos/RestricaoAlimentar";
import { Secao } from "@elementos/basicos/Secao";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { TextoDescritivo } from "./TextoDescritivo";

const TEMPO_DE_CARREGAMENTO = 2000;

export const RestricoesAlimentares = () => {
  const [restricoes, setRestricoes] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // setRestricoes(["Glúten", "Lactose", "Frutos do mar"]);

      setCarregando(false);
    }, TEMPO_DE_CARREGAMENTO);
  }, []);

  const handleRemoverRestricao = (e: React.MouseEvent) => {
    const restricao =
      e.currentTarget?.parentElement?.previousSibling?.textContent;
    if (!restricao) return;

    setRestricoes(restricoes.filter((item) => item !== restricao));
  };

  return (
    <div className={`flex flex-col gap-4 lg:flex`} id="restricoesAlimentares">
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
        {restricoes.length == 0 ? (
          <p className="text-justify">
            Você não possui restrições alimentares cadastradas. Caso queira
            adicionar alguma, entre em contato com a pessoa nutricionista.
          </p>
        ) : null}
        {/* <Botao
          texto="Adicionar"
          variante="adicionar"
          onClick={handleAdicionarRestricao}
        /> */}
      </Secao>
    </div>
  );
};

const LoadingSkeletons = () => {
  return Array.from({ length: 3 }).map((_, index) => (
    <Skeleton key={index} height={58} />
  ));
};

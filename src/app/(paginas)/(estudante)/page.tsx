"use client"

import { useState, useLayoutEffect } from "react";
import { HistoricoDeRefeicoes } from "@/app/elementos/modulos/estudante/HistoricoDeRefeicoes";
import { InformacoesDeEstudante } from "@/app/elementos/modulos/estudante/InformacoesDeEstudante";
import { RefeicoesAutorizadas } from "@/app/elementos/modulos/estudante/RefeicoesAutorizadas";
import { RefeicoesPorDia } from "@/app/elementos/modulos/estudante/RefeicoesPorDia";
import { RestricoesAlimentares } from "@/app/elementos/modulos/estudante/RestricoesAlimentares/RestricoesAlimentares";
import { useNavegacaoDaPaginaDeEstudante } from "@/app/lib/elementos/NavegacaoDaPaginaDeEstudante";

export default function Home() {
  const [navegacao, setNavegacao] = useNavegacaoDaPaginaDeEstudante()

  useLayoutEffect(() => {
    const handleResize = () => setNavegacao({ isMobile: window.innerWidth < 1024 })
    window.addEventListener("load", handleResize);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("load", handleResize);
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <>
      <div className="col-left flex flex-col gap-y-8">
        <InformacoesDeEstudante />
        {(!navegacao.isMobile || navegacao.pagina == "restricoesAlimentares") ?
          <RestricoesAlimentares /> : null
        }
        {(!navegacao.isMobile || navegacao.pagina == "refeicoesAutorizadas") ?
          <RefeicoesAutorizadas /> : null
        }
      </div>
      <div className="col-right flex flex-col gap-y-8 lg:row-span-3 lg:row-start-1">
        {(!navegacao.isMobile || navegacao.pagina == "refeicoesPorDia") ?
          <RefeicoesPorDia /> : null
        }
        {
          (!navegacao.isMobile || navegacao.pagina == "historicoDeRefeicoes") ?
            <HistoricoDeRefeicoes /> : null
        }
      </div>
    </>
  );
}

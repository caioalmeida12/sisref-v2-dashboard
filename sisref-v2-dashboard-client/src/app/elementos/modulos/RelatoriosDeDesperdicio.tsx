import { Botao } from "../basicos/Botao";
import { CabecalhoDeSecao } from "../basicos/CabecalhoDeSecao";
import { Secao } from "../basicos/Secao"
import { RelatorioDesperdicio } from "../componentes/RelatorioDesperdicio";

export const RelatoriosDeDesperdicio = () => {
    return (
        <Secao className="flex flex-col gap-y-4">
            <CabecalhoDeSecao titulo="Relatórios de desperdício" />
            <RelatorioDesperdicio variante="card" content="Conteúdo do relatório" date="2021-10-10" />
            <Botao variante="adicionar" texto="Adicionar relatório" />
        </Secao>
    );
}
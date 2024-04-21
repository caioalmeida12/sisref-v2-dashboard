import { CabecalhoPrincipal } from "../../basicos/CabecalhoPrincipal"
import { Secao } from "../../basicos/Secao"

export const TextoDescritivo = () => {
    return (
        <Secao>
            <div className="flex flex-col gap-4 text-justify">
                <CabecalhoPrincipal titulo="O que são alertas de restrição alimentar?" />
                <p> Quando você tentar reservar uma refeição que contenha um alimento sinalizado por você como restrição alimentar, o sistema exibirá uma caixa de confirmação alertando que tal refeição possui ingredientes sinalizados como restritos e perguntando se deseja confirmar a reserva. </p>
                <strong> Isso não impede que você reserve a refeição. </strong>
            </div>
        </Secao>
    )
}
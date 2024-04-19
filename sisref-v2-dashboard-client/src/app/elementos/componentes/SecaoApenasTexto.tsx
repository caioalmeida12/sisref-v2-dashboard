import { CabecalhoPrincipal } from "@elementos/basicos/CabecalhoPrincipal";
import { Secao } from "@elementos/basicos/Secao";

interface SecaoApenasTextoProps {
    titulo: string;
    texto: string;
}

export const SecaoApenasTexto = ({ titulo, texto }: SecaoApenasTextoProps) => {
    return (
        <Secao>
            <CabecalhoPrincipal titulo={titulo} />
            <p>{texto}</p>
        </Secao>
    );
};
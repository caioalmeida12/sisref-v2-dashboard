interface CabecalhoPrincipalProps {
    titulo: string;
}

export const CabecalhoPrincipal: React.FC<CabecalhoPrincipalProps> = ({ titulo }) => {
    return (
        <header>
            <h2 className="font-bold text-verde-400">{titulo}</h2>
        </header>
    );
}
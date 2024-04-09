interface CabeçalhoDeSecaoProps {
    titulo: string;
}

export const CabeçalhoDeSecao: React.FC<CabeçalhoDeSecaoProps> = ({ titulo }) => {
    return (
        <header className="bg-preto-400 p-4 rounded">
            <h2 className="text-branco-400 text-center font-bold">{titulo}</h2>
        </header>
    );
}
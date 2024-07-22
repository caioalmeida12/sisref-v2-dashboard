import { IRefeicao } from "@/app/elementos/interfaces/IRefeicao";
import { createContext, useState, ReactNode, useContext, useEffect } from "react";

interface RefeicoesContextProps {
    refeicoes: IRefeicao[];
    setRefeicoes: React.Dispatch<React.SetStateAction<IRefeicao[]>>;
    recarregar: boolean;
    setRecarregar: React.Dispatch<React.SetStateAction<boolean>>;
}

const RefeicoesContext = createContext<RefeicoesContextProps | undefined>(undefined);

export const RefeicoesProvider = ({ children }: { children: ReactNode }) => {
    const [refeicoes, setRefeicoes] = useState<IRefeicao[]>([]);
    const [recarregar, setRecarregar] = useState(false);

    return (
        <RefeicoesContext.Provider value={{ refeicoes, setRefeicoes, recarregar, setRecarregar }}>
            {children}
        </RefeicoesContext.Provider>
    );
};

export const useRefeicoes = (): RefeicoesContextProps => {
    const context = useContext(RefeicoesContext);
    if (context === undefined) {
        throw new Error("useRefeicoes must be used within a RefeicoesProvider");
    }
    return context;
};

export default RefeicoesContext;
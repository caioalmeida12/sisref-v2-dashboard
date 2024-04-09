interface SecaoProps {
    children: React.ReactNode;
}

export const Secao: React.FC<SecaoProps> = ({ children }) => {
    return (
        <section className={`p-4 bg-branco-400 rounded border-cinza-600 border-[1px]`}>
            {children}
        </section>
    );
}
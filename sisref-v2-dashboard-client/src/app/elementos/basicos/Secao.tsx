import { HTMLAttributes } from "react";

interface SecaoProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Secao: React.FC<SecaoProps> = ({ children, ...rest }: SecaoProps) => {
    return (
        <section className={`p-4 bg-branco-400 rounded border-cinza-600 border-[1px] ${rest.className}`} >
            {children}
        </section>
    );
}
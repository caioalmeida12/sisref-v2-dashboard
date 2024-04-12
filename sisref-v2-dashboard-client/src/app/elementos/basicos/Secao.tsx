import { HTMLAttributes } from "react";

interface SecaoProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const Secao: React.FC<SecaoProps> = ({ children, className }: SecaoProps) => {
    return (
        <section className={`${className} p-4 bg-branco-400 rounded border-cinza-600 border-[1px]`} >
            {children}
        </section>
    );
}
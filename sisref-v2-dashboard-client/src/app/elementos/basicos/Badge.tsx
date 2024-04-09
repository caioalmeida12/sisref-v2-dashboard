interface BadgeProps {
    texto: string;
    corDaBadge: string;
}

export const Badge: React.FC<BadgeProps> = ({ texto, corDaBadge }) => (
    <span className={`text-branco-400 py-1 px-4 font-bold rounded ${corDaBadge} border-[1px]`}>{texto}</span>
);
interface CampoDeSecaoProps {
    titulo: string;
    complemento: string;
    variante: "vertical" | "horizontal" | "horizontal-com-badge";
}

const Vertical: React.FC<CampoDeSecaoProps> = ({ titulo, complemento }) => (
    <div>
        <h3 className="font-bold">{titulo}:</h3>
        <p>{complemento}</p>
    </div>
);

const Horizontal: React.FC<CampoDeSecaoProps> = ({ titulo, complemento }) => (
    <div className="flex gap-1">
        <h3 className="font-bold">{titulo}:</h3>
        <p>{complemento}</p>
    </div>
);

const HorizontalComBadge: React.FC<CampoDeSecaoProps> = ({ titulo }) => (
    <div className="flex gap-1">
        <h3 className="font-bold">{titulo}:</h3>
        <span className="bg-verde-400 text-branco-400 p-1 rounded">Badge</span>
    </div>
);

const mapaDeVariantes = {
    "vertical": Vertical,
    "horizontal": Horizontal,
    "horizontal-com-badge": HorizontalComBadge,
};

export const CampoDeSecao: React.FC<CampoDeSecaoProps> = (props) => {
    const Componente = mapaDeVariantes[props.variante];
    return <Componente {...props} />;
};
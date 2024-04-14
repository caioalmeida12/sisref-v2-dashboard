import { Badge } from "../basicos/Badge";

type CampoDeSecaoProps = 
    | { variante: "vertical" | "horizontal", titulo: string, complemento: string }
    | { variante: "horizontal-com-badge", titulo: string, complemento: string, corDaBadge: string };

const Vertical: React.FC<CampoDeSecaoProps> = ({ titulo, complemento }) => (
    <div>
        <h3 className="font-bold">{titulo}:</h3>
        <p>{complemento}</p>
    </div>
);

const Horizontal: React.FC<CampoDeSecaoProps> = ({ titulo, complemento }) => (
    <div className="flex-col items-start flex gap-1 sm:items-center sm:flex-row">
        <h3 className="font-bold">{titulo}:</h3>
        <p>{complemento}</p>
    </div>
);

const HorizontalComBadge: React.FC<CampoDeSecaoProps> = (props) => {
    if (props.variante !== "horizontal-com-badge") {
        throw new Error("Invalid variant for HorizontalComBadge");
    }

    const { titulo, complemento, corDaBadge } = props;

    return (
        <div className="flex-col items-start flex gap-1 sm:items-center sm:flex-row">
            <h3 className="font-bold">{titulo}:</h3>
            <Badge texto={complemento} corDaBadge={corDaBadge} />
        </div>
    );
};
export const CampoDeSecao: React.FC<CampoDeSecaoProps> = (props) => {
    switch (props.variante) {
        case "vertical":
            return <Vertical {...props} />;
        case "horizontal":
            return <Horizontal {...props} />;
        case "horizontal-com-badge":
            return <HorizontalComBadge {...props} />;
    }
};
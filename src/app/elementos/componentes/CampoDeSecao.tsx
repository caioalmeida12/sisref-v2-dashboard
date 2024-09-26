import React from "react";

import { Badge } from "@elementos/basicos/Badge";

type CampoDeSecaoProps =
  | { variante: "vertical" | "horizontal"; titulo: string; complemento: string }
  | {
      variante: "horizontal-com-badge" | "vertical-com-badge";
      titulo: string;
      complemento: string;
      corDaBadge: string;
    };

const Vertical: React.FC<CampoDeSecaoProps> = ({ titulo, complemento }) => (
  <div>
    <h3 className="font-bold">{titulo}:</h3>
    <p>{complemento}</p>
  </div>
);

const Horizontal: React.FC<CampoDeSecaoProps> = ({ titulo, complemento }) => (
  <div className="flex flex-col items-start gap-1 md:flex-row md:items-center">
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
    <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center">
      <h3 className="font-bold">{titulo}:</h3>
      <Badge texto={complemento} corDaBadge={corDaBadge} />
    </div>
  );
};

const VerticalComBadge: React.FC<CampoDeSecaoProps> = (props) => {
  if (props.variante !== "vertical-com-badge") {
    throw new Error("Invalid variant for VerticalComBadge");
  }

  const { titulo, complemento, corDaBadge } = props;

  return (
    <div className="grid gap-y-1">
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
    case "vertical-com-badge":
      return <VerticalComBadge {...props} />;
  }
};

import React from "react";
import classnames from "classnames";

interface BadgeProps {
  texto: string;
  corDaBadge: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  texto,
  corDaBadge,
  className,
}) => (
  <span
    className={classnames(
      "text-branco-400",
      "px-4",
      "font-bold",
      "rounded",
      corDaBadge,
      "border-[1px]",
      className,
    )}
  >
    {texto}
  </span>
);

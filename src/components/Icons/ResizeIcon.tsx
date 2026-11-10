import React from "react";

export interface ResizeIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const ResizeIcon: React.FC<ResizeIconProps> = ({
  className,
  size = 16,
  color = "var(--accent-blue)",
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Flèche diagonale pointant vers le bas-gauche */}
      <polyline points="9 21 3 21 3 15" />
      <line x1="3" y1="21" x2="10" y2="14" />
      {/* Flèche diagonale pointant vers le haut-droite */}
      <polyline points="15 3 21 3 21 9" />
      <line x1="21" y1="3" x2="14" y2="10" />
    </svg>
  );
};

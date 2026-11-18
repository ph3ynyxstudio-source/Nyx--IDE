import React from "react";

export interface ToggleLayoutIconProps {
  className?: string;
  size?: number;
  color?: string;
}

/** Bascule d'orientation : un rectangle horizontal et un rectangle vertical croisés, avec flèche de rotation. */
export const ToggleLayoutIcon: React.FC<ToggleLayoutIconProps> = ({
  className,
  size = 16,
  color = "currentColor",
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Rectangle horizontal (mode wide) */}
      <rect x="2" y="13" width="13" height="8" rx="1.5" />
      {/* Rectangle vertical (mode tall) */}
      <rect x="13" y="2" width="8" height="13" rx="1.5" />
      {/* Flèche de rotation */}
      <path d="M3 9.5V7a4 4 0 0 1 4-4h2.5" />
      <polyline points="7.5 1 9.5 3 7.5 5" />
    </svg>
  );
};

import Image from "next/image";
import * as React from "react";

type LogoIconProps = {
  /** Size in pixels (width & height). Defaults to 40 */
  size?: number;
  /** Additional CSS classes for the wrapper */
  className?: string;
};

/**
 * App logo icon with dark/light mode support.
 * Renders the square logo SVG with a rounded-xl wrapper, primary shadow, and border.
 */
export function LogoIcon({
  size = 40,
  className = "",
}: LogoIconProps): React.JSX.Element {
  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-md shadow-primary/20 border border-primary/20 shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-vector-light.svg"
        alt="Evently Logo"
        fill
        className="object-cover dark:hidden"
        priority
      />
      <Image
        src="/logo-vector-dark.svg"
        alt="Evently Logo"
        fill
        className="object-cover hidden dark:block"
        priority
      />
    </div>
  );
}

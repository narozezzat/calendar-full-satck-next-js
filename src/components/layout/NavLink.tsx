"use client";

import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/routing";
import * as React from "react";
import { ComponentProps } from "react";

export function NavLink({
  className,
  ...props
}: ComponentProps<typeof Link>): React.JSX.Element {
  const path = usePathname();
  const isActive = path === props.href;

  return (
    <Link
      {...props}
      className={cn(
        "relative px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 border border-transparent select-none",
        isActive
          ? "text-primary bg-primary/10 border-primary/20 shadow-sm shadow-primary/5"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/30",
        className,
      )}
    />
  );
}

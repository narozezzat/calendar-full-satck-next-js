"use client";

import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PageLoaderProps {
  /**
   * Override label text (optional — defaults to translation).
   */
  label?: string;
  /**
   * Override subtitle text (optional — defaults to translation).
   */
  subtitle?: string;
  /**
   * CSS class for minimum height of the container.
   * @default "min-h-[75vh]"
   */
  minHeight?: string;
  /**
   * Optional extra CSS classes for the container.
   */
  className?: string;
}

/**
 * A highly polished, reusable Page Loader component featuring a
 * glassmorphic subtle glow background and animated spinning indicator.
 */
export function PageLoader({
  label,
  subtitle,
  minHeight = "min-h-[75vh]",
  className,
}: PageLoaderProps): React.JSX.Element {
  const t = useTranslations("common");
  const displayLabel = label ?? t("loading");
  const displaySubtitle = subtitle ?? t("pleaseWait");

  return (
    <div
      className={cn(
        "flex-grow flex flex-col gap-6 items-center justify-center w-full text-center px-4",
        minHeight,
        className,
      )}
    >
      {/* Spinning Loader Container with a subtle glow */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <Loader2 className="relative text-primary size-14 animate-spin stroke-[2]" />
      </div>

      {/* Loading text with gradient & styling */}
      <div className="space-y-1.5 z-10">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 tracking-tight">
          {displayLabel}
        </h2>
        <p className="text-xs text-muted-foreground font-medium animate-pulse tracking-wide uppercase">
          {displaySubtitle}
        </p>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { arSA, enUS } from "@clerk/localizations";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";

export function ThemedClerkProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const locale = useLocale();
  const localization = locale === "ar" ? arSA : enUS;

  return (
    <ClerkProvider
      localization={localization}
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorPrimary: "hsl(262, 83%, 58%)",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

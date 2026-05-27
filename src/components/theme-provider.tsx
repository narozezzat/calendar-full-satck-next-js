"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

import { THEME_COLORS } from "@/lib/theme"

function ThemeColorUpdater(): null {
  const { resolvedTheme } = useTheme()

  React.useEffect(() => {
    // Attempt to read the --theme-color CSS variable defined globally in globals.css
    let color = getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim()
    
    // Fall back to constants if the CSS variable is not yet resolved
    if (!color) {
      color = resolvedTheme === "dark" ? THEME_COLORS.dark : THEME_COLORS.light
    }
    
    // Find or create meta theme-color tag
    let meta = document.querySelector('meta[name="theme-color"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'theme-color')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', color)
  }, [resolvedTheme])

  return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps): React.JSX.Element {
  return (
    <NextThemesProvider {...props}>
      <ThemeColorUpdater />
      {children}
    </NextThemesProvider>
  )
}

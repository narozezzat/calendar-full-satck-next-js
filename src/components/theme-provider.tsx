"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

function ThemeColorUpdater(): null {
  const { resolvedTheme } = useTheme()

  React.useEffect(() => {
    // Dynamic background colors matching our theme (from globals.css CSS variables)
    // Dark background: HSL(224, 71%, 4%) -> #030712
    // Light background: HSL(240, 20%, 98%) -> #f9f9fb
    const color = resolvedTheme === "dark" ? "#030712" : "#f9f9fb"
    
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

import localFont from "next/font/local";
import { Cairo } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemedClerkProvider } from "@/components/theme/themed-clerk-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import * as React from "react";

export function generateStaticParams(): Array<{ locale: string }> {
  return routing.locales.map((locale) => ({ locale }));
}

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps): Promise<React.JSX.Element> {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const direction = locale === "ar" ? "rtl" : "ltr";
  const localeFontClass = locale === "ar" ? "font-arabic" : "font-sans";

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        className={cn(
          "h-dvh overflow-hidden bg-background antialiased relative",
          localeFontClass,
          geistSans.variable,
          cairo.variable,
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemedClerkProvider>
              {/* Global decorative background elements */}
              <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute inset-0 mesh-glow-1 opacity-70" />
                <div className="absolute inset-0 mesh-glow-2 opacity-50" />
              </div>

              <div className="relative z-10 h-full flex flex-col overflow-hidden">
                {children}
              </div>
              <Toaster richColors position="top-center" dir={direction} />
            </ThemedClerkProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

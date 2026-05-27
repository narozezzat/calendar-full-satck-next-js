import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "@/i18n/routing";
import { Sparkles, CheckCircle2, Clock, Calendar, ArrowRight, LogIn } from "lucide-react";
import * as React from "react";
import { LogoIcon } from "@/components/LogoIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";

export default async function HomePage(): Promise<React.JSX.Element> {
  const { userId } = auth();
  if (userId != null) {
    const locale = await getLocale();
    redirect({ href: "/events", locale });
  }

  const [t, tc] = await Promise.all([
    getTranslations("landing"),
    getTranslations("common"),
  ]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Landing Page Navbar */}
      <header className="shrink-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 sm:h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 font-bold text-lg sm:text-xl tracking-tight min-w-0">
            <LogoIcon size={40} className="size-8 sm:size-10" />
            <span className="hidden sm:inline truncate">{tc("appName")}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="sm"
                aria-label={tc("signIn")}
                className="hidden sm:inline-flex text-sm font-medium hover:bg-primary/5 hover:text-primary"
              >
                {tc("signIn")}
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="icon"
                aria-label={tc("signIn")}
                className="sm:hidden h-9 w-9 rounded-full border border-border/40 bg-secondary/15 hover:bg-secondary/40 hover:text-primary"
              >
                <LogIn aria-hidden="true" className="size-4" />
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                size="sm"
                className="shadow-lg shadow-primary/20 font-semibold bg-primary hover:bg-primary/95 text-primary-foreground px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
              >
                {tc("getStarted")}
              </Button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Scrollable Content Wrapper */}
      <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar">
        {/* Hero Section */}
        <main className="flex-1 lg:flex lg:items-center">
          <div className="container py-12 md:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Text */}
            <div className="lg:col-span-7 flex flex-col space-y-6 text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/25 text-primary w-fit animate-pulse-glow">
                <Sparkles aria-hidden="true" className="size-3.5" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.4] text-foreground">
                {t("heroTitle1")}<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-400 to-indigo-500 inline-block mt-3 pb-2">
                  {t("heroTitle2")}
                </span>
              </h1>
              <p className="text-muted-foreground text-lg sm:text-xl max-w-[560px] leading-relaxed">
                {t("heroDescription")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <SignUpButton mode="modal">
                  <Button size="lg" className="h-12 px-6 text-base font-semibold shadow-xl shadow-primary/25 group bg-primary text-primary-foreground hover:bg-primary/90">
                    {tc("getStartedFree")}
                    <ArrowRight aria-hidden="true" className="ms-2 size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button size="lg" variant="outline" className="h-12 px-6 text-base font-medium glass-card hover:bg-secondary/50">
                    {tc("bookAnEvent")}
                  </Button>
                </SignInButton>
              </div>

              {/* Quick Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-8">
                {[
                  t("benefits.unlimited"),
                  t("benefits.integration"),
                  t("benefits.availability"),
                  t("benefits.timezone")
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 aria-hidden="true" className="size-4.5 text-primary shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Sandbox Mockup */}
            <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-indigo-500 opacity-20 blur-xl animate-pulse" />
              <Card className="w-full max-w-[400px] glass-card border-border/40 relative overflow-hidden animate-float">
                {/* Decorative gradient blur */}
                <div className="absolute top-0 end-0 w-24 h-24 bg-primary/20 blur-2xl rounded-full" />

                <CardHeader className="border-b border-border/40 pb-5">
                  <div className="flex justify-between items-start">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold border border-primary/20">
                      {t("mockup.activePreview")}
                    </div>
                    <Clock aria-hidden="true" className="size-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl font-bold mt-3">{t("mockup.productDemo")}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-1">
                    <Calendar aria-hidden="true" className="size-3.5" />
                    <span>{t("mockup.availabilitySlot")}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 space-y-4">
                  <div className="text-sm font-semibold text-muted-foreground">{t("mockup.selectTime")}</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"].map((time, idx) => (
                      <div
                        key={idx}
                        className={`text-center py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${idx === 1
                          ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.03]"
                          : "bg-background/40 border-border/60 text-foreground hover:border-primary hover:bg-primary/5"
                          }`}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-secondary/30 border border-border/40 p-3 mt-4 text-xs text-muted-foreground flex gap-2">
                    <CheckCircle2 aria-hidden="true" className="size-4.5 text-primary shrink-0 mt-0.5" />
                    <span>{t("mockup.timezoneSync")}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 py-6 border-t border-border/40 bg-background/50">
          <div className="container flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
            <div className="flex gap-4">
              <span className="hover:text-foreground cursor-pointer">{t("footer.privacy")}</span>
              <span className="hover:text-foreground cursor-pointer">{t("footer.terms")}</span>
              <span className="hover:text-foreground cursor-pointer">{t("footer.security")}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
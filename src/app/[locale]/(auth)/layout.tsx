import { auth } from "@clerk/nextjs/server";
import { redirect } from "@/i18n/routing";
import * as React from "react";
import { ReactNode } from "react";
import { CalendarRange, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations, getLocale } from "next-intl/server";

export default async function AuthLayout({ children }: { children: ReactNode }): Promise<React.JSX.Element> {
  const { userId } = auth();
  if (userId != null) {
    const locale = await getLocale();
    redirect({ href: "/", locale });
  }

  const t = await getTranslations("auth");
  const tc = await getTranslations("common");

  return (
    <div className="flex-1 overflow-y-auto w-full grid grid-cols-1 lg:grid-cols-12 relative">
      
      {/* Theme Toggle & Language Switcher */}
      <div className="absolute top-4 end-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] start-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Left Pane: Branding & Features (hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-secondary/10 border-e border-border/40 relative z-10">
        
        {/* Logo / Header */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground select-none w-fit">
          <div className="bg-primary/10 p-2 rounded-lg text-primary border border-primary/20 shadow-sm shadow-primary/10">
            <CalendarRange aria-hidden="true" className="size-5" />
          </div>
          <span>{tc("appName")}</span>
        </Link>

        {/* Dynamic Content */}
        <div className="space-y-8 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary w-fit">
            <Sparkles aria-hidden="true" className="size-3 h-3" />
            <span>{t("badge")}</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground leading-[1.25]">
            {t("title")} <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">{t("titleHighlight")}</span>.
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1 rounded text-primary mt-0.5 border border-primary/20">
                <CheckCircle2 aria-hidden="true" className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t("features.calendar.title")}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{t("features.calendar.description")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1 rounded text-primary mt-0.5 border border-primary/20">
                <Zap aria-hidden="true" className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t("features.timezone.title")}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{t("features.timezone.description")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1 rounded text-primary mt-0.5 border border-primary/20">
                <ShieldCheck aria-hidden="true" className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t("features.booking.title")}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{t("features.booking.description")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-muted-foreground">
          {t("footer")}
        </div>
      </div>

      {/* Right Pane: Clerk Widget (always visible) */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 relative z-10">
        {/* Small header logo for mobile */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <CalendarRange aria-hidden="true" className="size-5 text-primary" />
            <span>{tc("appName")}</span>
          </Link>
        </div>

        <div className="w-full max-w-md flex justify-center scale-95 md:scale-100 transition-transform">
          {children}
        </div>
      </div>

    </div>
  );
}
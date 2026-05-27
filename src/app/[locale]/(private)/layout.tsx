import { NavLink } from "@/components/NavLink";
import { UserButton } from "@clerk/nextjs";
import * as React from "react";
import { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/LogoIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations } from "next-intl/server";

export default async function PrivateLayout({ children }: { children: ReactNode }): Promise<React.JSX.Element> {
    const [t, tc] = await Promise.all([
        getTranslations("nav"),
        getTranslations("common"),
    ]);

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Premium glassmorphic header */}
            <div className="shrink-0 w-full flex flex-col z-50 sticky top-0">
                <header className="w-full border-b border-border/40 bg-background/85 backdrop-blur-xl">
                    <div className="container flex items-center justify-between gap-3 sm:gap-4 h-14 sm:h-16">
                        {/* Brand */}
                        <Link
                            href="/events"
                            className="flex items-center gap-2 font-bold text-lg tracking-tight select-none shrink-0 group"
                            aria-label={tc("appName")}
                        >
                            <LogoIcon size={40} className="size-8 sm:size-10 transition-all group-hover:shadow-primary/30 group-hover:border-primary/40" />
                            <span className="inline text-foreground">{tc("appName")}</span>
                        </Link>

                        {/* Nav links — Desktop */}
                        <nav
                            className="hidden sm:flex items-center gap-2 ms-6 font-medium flex-1"
                            aria-label={t("calendar")}
                        >
                            <NavLink href="/events">{t("events")}</NavLink>
                            <NavLink href="/schedule">{t("schedule")}</NavLink>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ms-auto">
                            <LanguageSwitcher />
                            <ThemeToggle />
                            <div className="size-8 sm:size-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all overflow-hidden flex items-center justify-center">
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "size-full",
                                            userButtonTrigger: "focus:shadow-none focus:outline-none",
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Mobile Navigation Header */}
                <div className="sm:hidden w-full border-b border-border/40 bg-background/60 backdrop-blur-md">
                    <nav
                        className="container flex items-center justify-center gap-2 py-2.5"
                        aria-label={t("calendar")}
                    >
                        <NavLink href="/events" className="flex-1 flex justify-center text-center">{t("events")}</NavLink>
                        <NavLink href="/schedule" className="flex-1 flex justify-center text-center">{t("schedule")}</NavLink>
                    </nav>
                </div>
            </div>

            {/* Scrollable content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
                <div className="container py-6 sm:py-8 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}

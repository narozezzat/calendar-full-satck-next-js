import * as React from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/layout/LogoIcon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

/** Landing page top navigation bar: brand, locale/theme switches, auth CTAs. */
export async function LandingHeader(): Promise<React.JSX.Element> {
    const tc = await getTranslations("common");

    return (
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
    );
}

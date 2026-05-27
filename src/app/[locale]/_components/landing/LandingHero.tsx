import * as React from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

/** Hero copy column: badge, headline, description, CTAs and quick benefits. */
export async function LandingHero(): Promise<React.JSX.Element> {
    const [t, tc] = await Promise.all([
        getTranslations("landing"),
        getTranslations("common"),
    ]);

    const benefits = [
        t("benefits.unlimited"),
        t("benefits.integration"),
        t("benefits.availability"),
        t("benefits.timezone"),
    ];

    return (
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
            <p className="text-muted-foreground text-lg sm:text-xl max-w-[35rem] leading-relaxed">
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
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 aria-hidden="true" className="size-4.5 text-primary shrink-0" />
                        <span>{benefit}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

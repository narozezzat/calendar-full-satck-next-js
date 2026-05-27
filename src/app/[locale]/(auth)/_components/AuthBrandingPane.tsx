import * as React from "react";
import { CalendarRange, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AuthFeatureItem } from "./AuthFeatureItem";

/**
 * Left-hand branding column of the auth screens (hidden below `lg`): logo,
 * marketing headline, the feature highlights and a footer note.
 */
export async function AuthBrandingPane(): Promise<React.JSX.Element> {
    const [t, tc] = await Promise.all([
        getTranslations("auth"),
        getTranslations("common"),
    ]);

    const features = [
        { icon: CheckCircle2, title: t("features.calendar.title"), description: t("features.calendar.description") },
        { icon: Zap, title: t("features.timezone.title"), description: t("features.timezone.description") },
        { icon: ShieldCheck, title: t("features.booking.title"), description: t("features.booking.description") },
    ];

    return (
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
                    {features.map((feature) => (
                        <AuthFeatureItem
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>

            {/* Footer info */}
            <div className="text-xs text-muted-foreground">{t("footer")}</div>
        </div>
    );
}

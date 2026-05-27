import * as React from "react";
import { getTranslations } from "next-intl/server";

/** Landing page footer with copyright and legal links. */
export async function LandingFooter(): Promise<React.JSX.Element> {
    const t = await getTranslations("landing");

    return (
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
    );
}

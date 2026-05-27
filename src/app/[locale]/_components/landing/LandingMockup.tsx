import * as React from "react";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PREVIEW_SLOTS = ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"];

/** Floating product preview card showcasing the booking experience. */
export async function LandingMockup(): Promise<React.JSX.Element> {
    const t = await getTranslations("landing");

    return (
        <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-indigo-500 opacity-20 blur-xl animate-pulse" />
            <Card className="w-full max-w-[25rem] glass-card border-border/40 relative overflow-hidden animate-float">
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
                        {PREVIEW_SLOTS.map((time, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "text-center py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer",
                                    idx === 1
                                        ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.03]"
                                        : "bg-background/40 border-border/60 text-foreground hover:border-primary hover:bg-primary/5"
                                )}
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
    );
}

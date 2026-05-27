import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderAction {
    /** Localized navigation target (i18n `Link` href). */
    href: React.ComponentProps<typeof Link>["href"];
    /** Button label. */
    label: string;
    /** Optional leading icon for the button. */
    icon?: LucideIcon;
}

interface PageHeaderProps {
    /** Icon rendered in the rounded badge beside the title. */
    icon: LucideIcon;
    title: string;
    description?: string;
    /** Optional primary call-to-action rendered on the trailing side. */
    action?: PageHeaderAction;
    className?: string;
}

/**
 * Premium, RTL-aware dashboard page header: a frosted-glass panel with an
 * ambient glow, an icon badge + title/description, and an optional gradient
 * call-to-action button. Shared across the private dashboard pages so they
 * stay visually consistent.
 */
export default function PageHeader({
    icon: Icon,
    title,
    description,
    action,
    className,
}: PageHeaderProps): React.JSX.Element {
    const ActionIcon = action?.icon;

    return (
        <div className={cn("relative mb-10", className)}>
            {/* Subtle glowing ambient background */}
            <div className="absolute -top-10 -start-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 opacity-70 dark:opacity-40 pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-background/60 dark:bg-card/40 border border-border/50 p-6 sm:p-8 rounded-3xl shadow-sm backdrop-blur-xl relative overflow-hidden">

                {/* Decorative glass reflection */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="space-y-2 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20 shadow-inner">
                            <Icon aria-hidden="true" className="size-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                    </div>
                    {description ? (
                        <p className="text-sm text-muted-foreground max-w-lg leading-relaxed ms-1 sm:ms-14">
                            {description}
                        </p>
                    ) : null}
                </div>

                {action ? (
                    <Button
                        asChild
                        className="w-full sm:w-auto shadow-xl shadow-primary/25 bg-gradient-to-br from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white font-semibold h-12 px-6 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 group relative overflow-hidden z-10 border border-primary/20"
                    >
                        <Link href={action.href} className="flex items-center justify-center gap-2">
                            {/* Shimmer reflection */}
                            <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            {ActionIcon ? (
                                <ActionIcon aria-hidden="true" className="size-5 transition-transform group-hover:rotate-12" />
                            ) : null}
                            <span className="text-base sm:text-sm">{action.label}</span>
                        </Link>
                    </Button>
                ) : null}
            </div>
        </div>
    );
}

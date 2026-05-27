import { Button } from "@/components/ui/button";
import { CopyEventButton } from "@/components/CopyEventButton";
import { DeleteEventButton } from "@/components/DeleteEventButton";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { formatEventDescription } from "@/lib/formatters";
import { EventCardProps } from "@/types/eventTypes";
import { Clock, EyeOff, Edit, ExternalLink, Check } from "lucide-react";
import * as React from "react";
import { useTranslations, useLocale } from "next-intl";

interface EventCardSelectionProps extends EventCardProps {
    /** When provided, the card renders a selection checkbox and becomes selectable. */
    selectable?: boolean;
    selected?: boolean;
    onToggleSelect?: (id: string) => void;
}

export default function EventCard({
    id,
    isActive,
    name,
    description,
    durationInMinutes,
    clerkUserId,
    selectable = false,
    selected = false,
    onToggleSelect,
}: EventCardSelectionProps): React.JSX.Element {
    const t = useTranslations("common");
    const locale = useLocale();

    return (
        <div
            className={cn(
                "group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 shadow-sm",
                "bg-card/95 dark:bg-card/50 backdrop-blur-xl border border-border/60",
                isActive
                    ? "hover-card-glow hover:border-primary/40"
                    : "hover:-translate-y-0.5 hover:border-border/80",
                selected && "ring-2 ring-primary border-primary/30 shadow-lg shadow-primary/10 bg-primary/[0.01] dark:bg-primary/[0.02]"
            )}
        >
            {/* ─── BODY ─── */}
            <div className={cn(
                "flex flex-col items-start text-start px-6 pt-6 pb-5 flex-1 relative w-full",
                !isActive && "opacity-60"
            )}>

                {/* Top Header Bar */}
                <div className="flex items-center justify-between w-full mb-4">
                    {/* Selection checkbox */}
                    {selectable ? (
                        <button
                            type="button"
                            role="checkbox"
                            aria-checked={selected}
                            aria-label={t("select")}
                            onClick={() => onToggleSelect?.(id)}
                            className={cn(
                                "flex size-5 items-center justify-center rounded-full border-[1.5px] cursor-pointer",
                                "transition-all duration-200 active:scale-90",
                                selected
                                    ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                                    : "border-border/80 bg-card hover:border-primary/50"
                            )}
                        >
                            <Check
                                aria-hidden="true"
                                className={cn(
                                    "size-3 transition-all duration-150",
                                    selected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                                )}
                                strokeWidth={2.5}
                            />
                        </button>
                    ) : (
                        <div />
                    )}

                    {/* Status Badge */}
                    <div className="z-10">
                        {isActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                </span>
                                <span>{t("active")}</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-muted-foreground/10 text-muted-foreground/50 border border-border/40">
                                <EyeOff aria-hidden="true" className="size-3" />
                                <span>{t("inactive")}</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Name & Duration Row */}
                <div className="flex items-start justify-between gap-4 w-full">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight line-clamp-2 flex-1 group-hover:text-primary transition-colors duration-200">
                        {name}
                    </h3>
                    <div className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 shrink-0",
                        "text-xs font-semibold",
                        isActive
                            ? "text-primary bg-primary/10 border border-primary/20"
                            : "text-muted-foreground bg-muted border border-border/30"
                    )}>
                        <Clock aria-hidden="true" className="size-3.5" />
                        <span>{formatEventDescription(durationInMinutes, locale)}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-3.5 w-full min-h-[40px]">
                    {description != null ? (
                        <p className="text-sm text-muted-foreground/75 leading-relaxed line-clamp-2 break-words">
                            {description}
                        </p>
                    ) : (
                        <p className="text-xs text-muted-foreground/45 italic leading-relaxed">
                            {locale === "ar" ? "لا يوجد وصف لهذه الفعالية" : "No description provided"}
                        </p>
                    )}
                </div>
            </div>

            {/* ─── ACTIONS ─── */}
            <div className={cn(
                "px-6 py-4 border-t border-border/10 bg-muted/15 dark:bg-muted/5 flex items-center gap-1.5 mt-auto w-full",
                !isActive && "opacity-65"
            )}>
                {/* Edit — primary action */}
                <Button
                    size="sm"
                    asChild
                    className={cn(
                        "h-8 px-3.5 text-xs font-medium rounded-lg",
                        "bg-primary hover:bg-primary/90 text-primary-foreground",
                        "shadow-sm transition-all duration-200"
                    )}
                >
                    <Link href={`/events/${id}/edit`} className="flex items-center gap-1.5">
                        <Edit aria-hidden="true" className="size-3" />
                        {t("edit")}
                    </Link>
                </Button>

                {/* Secondary actions */}
                {isActive ? (
                    <>
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground rounded-lg"
                        >
                            <Link
                                href={`/book/${clerkUserId}/${id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5"
                            >
                                <ExternalLink aria-hidden="true" className="size-3" />
                                <span>{t("preview")}</span>
                            </Link>
                        </Button>

                        <CopyEventButton
                            variant="ghost"
                            size="sm"
                            eventId={id}
                            clerkUserId={clerkUserId}
                            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground rounded-lg"
                        />
                    </>
                ) : null}

                <div className="flex-1" />

                <DeleteEventButton
                    id={id}
                    className="size-7 rounded-lg border-none bg-transparent text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 shadow-none"
                />
            </div>
        </div>
    );
}
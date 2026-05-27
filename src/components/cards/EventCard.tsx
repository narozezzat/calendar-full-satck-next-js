import { Button } from "@/components/ui/button";
import { CopyEventButton } from "@/components/CopyEventButton";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { formatEventDescription } from "@/lib/formatters";
import { EventCardProps } from "@/types/eventTypes";
import { Clock, EyeOff, Edit, ExternalLink, Check, Trash2 } from "lucide-react";
import * as React from "react";
import { useTranslations, useLocale } from "next-intl";

interface EventCardSelectionProps extends EventCardProps {
    /** When provided, the card renders a selection checkbox and becomes selectable. */
    selectable?: boolean;
    selected?: boolean;
    onToggleSelect?: (id: string) => void;
    onDeleteClick?: (id: string, name: string) => void;
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
    onDeleteClick,
}: EventCardSelectionProps): React.JSX.Element {
    const t = useTranslations("common");
    const locale = useLocale();

    return (
        <div
            className={cn(
                "group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300",
                "border border-border/50 dark:border-border/40",
                "bg-card/95 dark:bg-gradient-to-b dark:from-[#111625]/90 dark:to-[#0B0F19]/95 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.25)]",
                isActive
                    ? "hover:border-primary/50 dark:hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(139,92,246,0.12)] dark:hover:shadow-[0_12px_35px_rgba(139,92,246,0.18)]"
                    : "hover:-translate-y-0.5 hover:border-border",
                selected && "ring-2 ring-primary border-primary/40 shadow-lg shadow-primary/10 bg-primary/[0.02] dark:bg-primary/[0.03]"
            )}
        >
            {/* ─── BODY ─── */}
            <div className={cn(
                "flex flex-col items-start text-start px-6 pt-6 pb-5 flex-1 relative w-full",
                !isActive && "opacity-75"
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
                                "flex size-5 items-center justify-center rounded-full border-[0.09375rem] cursor-pointer",
                                "transition-all duration-200 active:scale-90",
                                selected
                                    ? "border-primary bg-primary text-white shadow-sm shadow-primary/30"
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
                        <div className="size-5" />
                    )}

                    {/* Status & Duration Badges */}
                    <div className="flex items-center gap-2 z-10">
                        {/* Duration Badge */}
                        <div className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold border transition-all duration-200",
                            isActive
                                ? "text-primary bg-primary/10 border-primary/20 dark:bg-primary/20 dark:border-primary/30 hover:bg-primary/15"
                                : "text-muted-foreground/80 bg-muted border-border/30"
                        )}>
                            <Clock aria-hidden="true" className="size-3" />
                            <span>{formatEventDescription(durationInMinutes, locale)}</span>
                        </div>

                        {/* Status Badge */}
                        <div>
                            {isActive ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                    </span>
                                    <span>{t("active")}</span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold bg-muted-foreground/10 text-muted-foreground/50 border border-border/40">
                                    <EyeOff aria-hidden="true" className="size-3" />
                                    <span>{t("inactive")}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Name Row */}
                <div className="w-full mt-1.5">
                    <h3 className={cn(
                        "text-lg sm:text-xl font-bold tracking-tight line-clamp-2 transition-colors duration-200",
                        isActive
                            ? "text-foreground group-hover:text-primary"
                            : "text-muted-foreground"
                    )}>
                        {name}
                    </h3>
                </div>

                {/* Description */}
                <div className="mt-3 w-full min-h-[2.5rem] flex-1">
                    {description != null ? (
                        <p className="text-sm text-muted-foreground/75 leading-relaxed line-clamp-2 break-words">
                            {description}
                        </p>
                    ) : (
                        <p className="text-xs text-muted-foreground/40 italic leading-relaxed">
                            {locale === "ar" ? "لا يوجد وصف لهذه الفعالية" : "No description provided"}
                        </p>
                    )}
                </div>
            </div>

            {/* ─── ACTIONS ─── */}
            <div className={cn(
                "px-6 py-4 border-t border-border/40 dark:border-border/30 bg-slate-50/70 dark:bg-slate-950/40 backdrop-blur-md flex items-center gap-2 mt-auto w-full",
                !isActive && "opacity-75"
            )}>
                {/* Edit — primary action */}
                <Button
                    size="sm"
                    asChild
                    className={cn(
                        "h-9 px-4 text-xs font-semibold rounded-xl relative overflow-hidden",
                        "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-primary-foreground",
                        "shadow-md shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 border border-primary/15 group/btn"
                    )}
                >
                    <Link href={`/events/${id}/edit`} className="flex items-center gap-1.5">
                        <Edit aria-hidden="true" className="size-3.5 transition-transform group-hover/btn:rotate-12" />
                        <span>{t("edit")}</span>
                    </Link>
                </Button>

                {/* Secondary actions */}
                {isActive ? (
                    <>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-9 px-3.5 text-xs text-foreground/90 bg-card dark:bg-card/25 border border-border/50 dark:border-border/60 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-foreground hover:border-border transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none"
                        >
                            <Link
                                href={`/book/${clerkUserId}/${id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5"
                            >
                                <ExternalLink aria-hidden="true" className="size-3.5" />
                                <span>{t("preview")}</span>
                            </Link>
                        </Button>

                        <CopyEventButton
                            variant="outline"
                            size="sm"
                            eventId={id}
                            clerkUserId={clerkUserId}
                            className="h-9 w-9 lg:w-auto px-0 lg:px-3.5 text-xs text-foreground/90 bg-card dark:bg-card/25 border border-border/50 dark:border-border/60 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-foreground hover:border-border transition-all duration-150 flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none"
                        />
                    </>
                ) : null}

                <div className="flex-1" />

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDeleteClick?.(id, name)}
                    className="size-9 rounded-xl border border-destructive/25 bg-destructive/5 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-150 flex items-center justify-center"
                    aria-label={t("delete")}
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>
        </div>
    );
}
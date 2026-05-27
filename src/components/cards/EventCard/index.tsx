import * as React from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { EventCardProps } from "@/types/eventTypes";
import { EventDurationBadge } from "./EventDurationBadge";
import { EventStatusBadge } from "./EventStatusBadge";
import { EventCardCheckbox } from "./EventCardCheckbox";
import { EventCardActions } from "./EventCardActions";

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
            <div
                className={cn(
                    "flex flex-col items-start text-start px-6 pt-6 pb-5 flex-1 relative w-full",
                    !isActive && "opacity-75"
                )}
            >
                {/* Top Header Bar */}
                <div className="flex items-center justify-between w-full mb-4">
                    {selectable ? (
                        <EventCardCheckbox
                            selected={selected}
                            onToggle={() => onToggleSelect?.(id)}
                        />
                    ) : (
                        <div className="size-5" />
                    )}

                    <div className="flex items-center gap-2 z-10">
                        <EventDurationBadge durationInMinutes={durationInMinutes} isActive={isActive} />
                        <EventStatusBadge isActive={isActive} />
                    </div>
                </div>

                {/* Name Row */}
                <div className="w-full mt-1.5">
                    <h3
                        className={cn(
                            "text-lg sm:text-xl font-bold tracking-tight line-clamp-2 transition-colors duration-200",
                            isActive
                                ? "text-foreground group-hover:text-primary"
                                : "text-muted-foreground"
                        )}
                    >
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
            <EventCardActions
                id={id}
                name={name}
                isActive={isActive}
                clerkUserId={clerkUserId}
                onDeleteClick={onDeleteClick}
            />
        </div>
    );
}

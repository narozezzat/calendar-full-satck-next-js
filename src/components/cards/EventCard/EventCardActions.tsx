import * as React from "react";
import { Edit, ExternalLink, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CopyEventButton } from "@/components/events/CopyEventButton";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface EventCardActionsProps {
    id: string;
    name: string;
    isActive: boolean;
    clerkUserId: string;
    onDeleteClick?: (id: string, name: string) => void;
}

const secondaryActionClassName =
    "h-9 px-3.5 text-xs text-foreground/90 bg-card dark:bg-card/25 border border-border/50 dark:border-border/60 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-foreground hover:border-border transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none";

/** Footer action bar of an event card: edit, preview, copy link, delete. */
export function EventCardActions({
    id,
    name,
    isActive,
    clerkUserId,
    onDeleteClick,
}: EventCardActionsProps): React.JSX.Element {
    const t = useTranslations("common");

    return (
        <div
            className={cn(
                "px-6 py-4 border-t border-border/40 dark:border-border/30 bg-slate-50/70 dark:bg-slate-950/40 backdrop-blur-md flex items-center gap-2 mt-auto w-full",
                !isActive && "opacity-75"
            )}
        >
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

            {/* Secondary actions (only for active events) */}
            {isActive ? (
                <>
                    <Button asChild variant="outline" size="sm" className={secondaryActionClassName}>
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
    );
}

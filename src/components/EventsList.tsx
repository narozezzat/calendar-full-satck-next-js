"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckSquare, Square, Trash2, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/cards/EventCard";
import { deleteManyEvents } from "@/server/actions/events";
import { EventCardProps } from "@/types/eventTypes";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EventsListProps {
    events: EventCardProps[];
}

export default function EventsList({ events }: EventsListProps): React.JSX.Element {
    const t = useTranslations("events");
    const tForm = useTranslations("eventForm");
    const router = useRouter();

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const selectedCount = selected.size;
    const allSelected = selectedCount > 0 && selectedCount === events.length;

    const toggleSelect = (id: string): void => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleSelectAll = (): void => {
        setSelected((prev) =>
            prev.size === events.length ? new Set() : new Set(events.map((e) => e.id))
        );
    };

    const clearSelection = (): void => setSelected(new Set());

    const handleDeleteSelected = (): void => {
        startTransition(async () => {
            const ids = Array.from(selected);
            const res = await deleteManyEvents(ids);
            if (res.error) {
                toast.error(tForm("errorDelete"));
                return;
            }
            toast.success(t("bulkDeleteSuccess", { count: res.deletedCount }));
            clearSelection();
            setShowConfirm(false);
            router.refresh();
        });
    };

    return (
        <>
            {/* Selection toolbar */}
            <div className="flex items-center justify-between gap-3 -mt-2">
                <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                >
                    {allSelected ? (
                        <CheckSquare aria-hidden="true" className="size-4 text-primary" />
                    ) : (
                        <Square aria-hidden="true" className="size-4 group-hover:text-primary transition-colors" />
                    )}
                    {allSelected ? t("deselectAll") : t("selectAll")}
                </button>

                <span className={cn(
                    "text-xs font-semibold rounded-full px-3 py-1 transition-all duration-300",
                    selectedCount > 0
                        ? "text-primary bg-primary/10 border border-primary/20 shadow-sm shadow-primary/10"
                        : "text-muted-foreground bg-secondary/60 border border-border/40"
                )}>
                    {selectedCount > 0
                        ? t("selectedCount", { count: selectedCount })
                        : t("noSelection", { count: events.length })}
                </span>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        {...event}
                        selectable
                        selected={selected.has(event.id)}
                        onToggleSelect={toggleSelect}
                    />
                ))}
            </div>

            {/* Floating bulk-action bar */}
            <div
                className={cn(
                    "fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300",
                    selectedCount > 0
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                )}
            >
                <div className="pointer-events-auto flex items-center gap-3 sm:gap-4 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-2xl shadow-black/10 px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-bold">
                            {selectedCount}
                        </span>
                        <span className="hidden sm:inline text-sm font-medium text-foreground">
                            {t("selectedCount", { count: selectedCount })}
                        </span>
                    </div>

                    <div className="h-6 w-px bg-border/60" />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSelection}
                        className="h-9 text-muted-foreground hover:text-foreground"
                    >
                        <X aria-hidden="true" className="size-4 sm:me-1.5" />
                        <span className="hidden sm:inline">{t("clearSelection")}</span>
                    </Button>

                    <Button
                        size="sm"
                        onClick={() => setShowConfirm(true)}
                        className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20 font-semibold"
                    >
                        <Trash2 aria-hidden="true" className="size-4 me-1.5" />
                        {t("deleteSelected")}
                    </Button>
                </div>
            </div>

            {/* Confirmation dialog */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent className="glass-card border-border/60">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive flex items-center gap-2">
                            <Trash2 className="size-5" />
                            {t("bulkDeleteTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("bulkDeleteDescription", { count: selectedCount })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel
                            disabled={isPending}
                            className="border-border/50 hover:bg-secondary/50"
                        >
                            {tForm("cancelButton")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDeleteSelected();
                            }}
                        >
                            {isPending ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : null}
                            {t("deleteSelected")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

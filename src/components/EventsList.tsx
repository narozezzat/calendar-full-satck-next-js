"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckSquare, Square, Trash2, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DataPagination } from "@/components/DataPagination";
import EventCard from "@/components/cards/EventCard";
import { deleteEvent, deleteManyEvents } from "@/server/actions/events";
import { EventCardProps } from "@/types/eventTypes";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import { SuccessDialog } from "@/components/SuccessDialog";
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
    /** Events for the current page (already sliced server-side). */
    events: EventCardProps[];
    /** 1-based active page index. */
    currentPage: number;
    /** Total number of pages across all events. */
    totalPages: number;
    /** Total number of events across all pages (for the count badge). */
    totalCount: number;
    /** Optional search component to unify into the control toolbar. */
    searchComponent?: React.ReactNode;
}

export default function EventsList({
    events,
    currentPage,
    totalPages,
    totalCount,
    searchComponent,
}: EventsListProps): React.JSX.Element {
    const t = useTranslations("events");
    const tForm = useTranslations("eventForm");
    const router = useRouter();

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [shouldOpenSuccess, setShouldOpenSuccess] = useState(false);
    const [lastDeletedCount, setLastDeletedCount] = useState(0);
    const [eventToDelete, setEventToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isSinglePending, startSingleTransition] = useTransition();
    const [successType, setSuccessType] = useState<"single" | "bulk">("single");

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
            setLastDeletedCount(ids.length);
            const res = await deleteManyEvents(ids);
            if (res.error) {
                toast.error(tForm("errorDelete"));
                return;
            }
            clearSelection();
            setSuccessType("bulk");
            setShouldOpenSuccess(true);
            setShowConfirm(false);
        });
    };

    const handleSingleDelete = (): void => {
        if (!eventToDelete) return;
        startSingleTransition(async () => {
            const res = await deleteEvent(eventToDelete.id);
            if (res.error) {
                toast.error(tForm("errorDelete"));
                return;
            }
            setSuccessType("single");
            setShouldOpenSuccess(true);
            setEventToDelete(null);
        });
    };

    return (
        <>
            {/* Unified Search & Selection Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-card/30 dark:bg-slate-900/20 border border-border/40 backdrop-blur-md shadow-sm">
                {searchComponent ? (
                    <div className="w-full md:max-w-md">
                        {searchComponent}
                    </div>
                ) : null}

                <div className={cn(
                    "flex items-center justify-between gap-6 w-full",
                    searchComponent ? "md:w-auto md:justify-end" : "justify-between"
                )}>
                    <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground active:scale-95 transition-all group cursor-pointer"
                    >
                        {allSelected ? (
                            <CheckSquare aria-hidden="true" className="size-4 text-primary" />
                        ) : (
                            <Square aria-hidden="true" className="size-4 group-hover:text-primary transition-colors" />
                        )}
                        <span>{allSelected ? t("deselectAll") : t("selectAll")}</span>
                    </button>

                    <span className={cn(
                        "text-xs font-bold rounded-full px-3 py-1.5 transition-all duration-300 shadow-inner",
                        selectedCount > 0
                            ? "text-primary bg-primary/10 border border-primary/25 shadow-sm shadow-primary/5"
                            : "text-muted-foreground/80 bg-secondary/50 border border-border/40"
                    )}>
                        {selectedCount > 0
                            ? t("selectedCount", { count: selectedCount })
                            : t("noSelection", { count: totalCount })}
                    </span>
                </div>
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
                        onDeleteClick={(id, name) => setEventToDelete({ id, name })}
                    />
                ))}
            </div>

            {/* Pagination (server-driven via the ?page= search param) */}
            <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                className="pt-4"
            />

            {/* Floating bulk-action bar */}
            <div
                className={cn(
                    "fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300",
                    selectedCount > 0
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                )}
            >
                <div
                    aria-hidden={selectedCount === 0}
                    className={cn(
                        "flex items-center gap-3 sm:gap-4 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-2xl shadow-black/10 px-4 py-3 sm:px-5",
                        selectedCount > 0 ? "pointer-events-auto" : "pointer-events-none"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-bold">
                            {selectedCount}
                        </span>
                        <span className="hidden sm:inline text-sm font-medium text-foreground">
                            {t("selected")}
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
                <AlertDialogContent 
                    className="glass-card border-border/60"
                    onCloseAutoFocus={(e) => {
                        if (shouldOpenSuccess) {
                            e.preventDefault();
                            setShouldOpenSuccess(false);
                            setShowSuccessDialog(true);
                        }
                    }}
                >
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

            {/* Single delete confirmation dialog */}
            <AlertDialog open={eventToDelete !== null} onOpenChange={(open) => !open && setEventToDelete(null)}>
                <AlertDialogContent 
                    className="glass-card border-border/60"
                    onCloseAutoFocus={(e) => {
                        if (shouldOpenSuccess) {
                            e.preventDefault();
                            setShouldOpenSuccess(false);
                            setShowSuccessDialog(true);
                        }
                    }}
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive flex items-center gap-2">
                            <Trash2 className="size-5" />
                            {tForm("deleteTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {tForm("deleteDescription")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel
                            disabled={isSinglePending}
                            className="border-border/50 hover:bg-secondary/50"
                        >
                            {tForm("cancelButton")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isSinglePending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSingleDelete();
                            }}
                        >
                            {isSinglePending ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : null}
                            {tForm("deleteConfirm")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <SuccessDialog
                open={showSuccessDialog}
                onOpenChange={setShowSuccessDialog}
                title={successType === "single" ? tForm("deleteSuccessTitle") : t("bulkDeleteSuccessTitle")}
                description={
                    successType === "single"
                        ? tForm("deleteSuccessMessage")
                        : t("bulkDeleteSuccessMessage", { count: lastDeletedCount })
                }
                onContinue={() => router.refresh()}
            />
        </>
    );
}

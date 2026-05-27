"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { DataPagination } from "@/components/DataPagination";
import EventCard from "@/components/cards/EventCard";
import { SuccessDialog } from "@/components/SuccessDialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteEvent, deleteManyEvents } from "@/server/actions/events";
import { EventCardProps } from "@/types/eventTypes";
import { useRouter } from "@/i18n/routing";
import { SelectionToolbar } from "./SelectionToolbar";
import { BulkActionBar } from "./BulkActionBar";

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

    /** Chains the success dialog open once a delete dialog finishes closing. */
    const handleCloseAutoFocus = (e: Event): void => {
        if (shouldOpenSuccess) {
            e.preventDefault();
            setShouldOpenSuccess(false);
            setShowSuccessDialog(true);
        }
    };

    return (
        <>
            <SelectionToolbar
                allSelected={allSelected}
                selectedCount={selectedCount}
                totalCount={totalCount}
                onToggleSelectAll={toggleSelectAll}
                searchComponent={searchComponent}
            />

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
            <DataPagination currentPage={currentPage} totalPages={totalPages} className="pt-4" />

            <BulkActionBar
                selectedCount={selectedCount}
                onClear={clearSelection}
                onDelete={() => setShowConfirm(true)}
            />

            {/* Bulk delete confirmation */}
            <DeleteConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={t("bulkDeleteTitle")}
                description={t("bulkDeleteDescription", { count: selectedCount })}
                confirmLabel={t("deleteSelected")}
                cancelLabel={tForm("cancelButton")}
                isPending={isPending}
                onConfirm={handleDeleteSelected}
                onCloseAutoFocus={handleCloseAutoFocus}
            />

            {/* Single delete confirmation */}
            <DeleteConfirmDialog
                open={eventToDelete !== null}
                onOpenChange={(open) => !open && setEventToDelete(null)}
                title={tForm("deleteTitle")}
                description={tForm("deleteDescription")}
                confirmLabel={tForm("deleteConfirm")}
                cancelLabel={tForm("cancelButton")}
                isPending={isSinglePending}
                onConfirm={handleSingleDelete}
                onCloseAutoFocus={handleCloseAutoFocus}
            />

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

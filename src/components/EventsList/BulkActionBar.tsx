"use client";

import * as React from "react";
import { Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BulkActionBarProps {
    selectedCount: number;
    onClear: () => void;
    onDelete: () => void;
}

/**
 * Floating, animated bar pinned to the bottom of the viewport. Slides into view
 * whenever one or more events are selected, offering clear/delete actions.
 */
export function BulkActionBar({
    selectedCount,
    onClear,
    onDelete,
}: BulkActionBarProps): React.JSX.Element {
    const t = useTranslations("events");
    const hasSelection = selectedCount > 0;

    return (
        <div
            className={cn(
                "fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300",
                hasSelection ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
        >
            <div
                aria-hidden={!hasSelection}
                className={cn(
                    "flex items-center gap-3 sm:gap-4 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-2xl shadow-black/10 px-4 py-3 sm:px-5",
                    hasSelection ? "pointer-events-auto" : "pointer-events-none"
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
                    onClick={onClear}
                    className="h-9 text-muted-foreground hover:text-foreground"
                >
                    <X aria-hidden="true" className="size-4 sm:me-1.5" />
                    <span className="hidden sm:inline">{t("clearSelection")}</span>
                </Button>

                <Button
                    size="sm"
                    onClick={onDelete}
                    className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20 font-semibold"
                >
                    <Trash2 aria-hidden="true" className="size-4 me-1.5" />
                    {t("deleteSelected")}
                </Button>
            </div>
        </div>
    );
}

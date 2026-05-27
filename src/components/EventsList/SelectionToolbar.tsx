"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SelectionToolbarProps {
    allSelected: boolean;
    selectedCount: number;
    /** Total events across all pages, shown when nothing is selected. */
    totalCount: number;
    onToggleSelectAll: () => void;
    /** Optional search control unified into the toolbar. */
    searchComponent?: React.ReactNode;
}

/** Top toolbar combining the optional search box with select-all + a count badge. */
export function SelectionToolbar({
    allSelected,
    selectedCount,
    totalCount,
    onToggleSelectAll,
    searchComponent,
}: SelectionToolbarProps): React.JSX.Element {
    const t = useTranslations("events");

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-card dark:bg-[#0E1320]/60 border border-border/60 dark:border-border/30 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.15)] backdrop-blur-md">
            {searchComponent ? (
                <div className="w-full md:max-w-md">{searchComponent}</div>
            ) : null}

            <div
                className={cn(
                    "flex items-center justify-between gap-6 w-full",
                    searchComponent ? "md:w-auto md:justify-end" : "justify-between"
                )}
            >
                <button
                    type="button"
                    onClick={onToggleSelectAll}
                    className="flex items-center gap-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground active:scale-95 transition-all group cursor-pointer"
                >
                    <div
                        className={cn(
                            "flex size-5 items-center justify-center rounded-md border-[0.09375rem] transition-all duration-200",
                            allSelected
                                ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                : "border-border/80 bg-background dark:bg-slate-950/40 group-hover:border-primary/50"
                        )}
                    >
                        <Check
                            aria-hidden="true"
                            className={cn(
                                "size-3 transition-all duration-150 text-white",
                                allSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                            )}
                            strokeWidth={3.5}
                        />
                    </div>
                    <span>{allSelected ? t("deselectAll") : t("selectAll")}</span>
                </button>

                <span
                    className={cn(
                        "text-[0.6875rem] font-semibold rounded-full px-3 py-1.5 transition-all duration-300 shadow-inner",
                        selectedCount > 0
                            ? "text-primary bg-primary/10 border border-primary/20 shadow-sm shadow-primary/5"
                            : "text-muted-foreground/80 bg-slate-50 dark:bg-slate-900/40 border border-border/40 dark:border-border/30"
                    )}
                >
                    {selectedCount > 0
                        ? t("selectedCount", { count: selectedCount })
                        : t("noSelection", { count: totalCount })}
                </span>
            </div>
        </div>
    );
}

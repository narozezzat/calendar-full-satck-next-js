"use client";

import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface DataPaginationProps {
    /** 1-based index of the active page. */
    currentPage: number;
    /** Total number of pages. */
    totalPages: number;
    /**
     * Optional handler. When provided the control is "controlled" and renders
     * buttons that call this instead of touching the URL — for client-only
     * lists. When omitted it drives navigation through the `?page=` search
     * param (default), the right mode for server-side pagination.
     */
    onPageChange?: (page: number) => void;
    /** Query-string key used for URL-driven navigation. */
    pageParam?: string;
    /**
     * Smoothly scroll the nearest scrollable ancestor (the content area) back
     * to the top whenever the active page changes. Defaults to true.
     */
    scrollContentToTop?: boolean;
    className?: string;
}

/**
 * Builds a compact list of page tokens with ellipses, e.g.
 * [1, 2, 3, 4, 5] or [1, "ellipsis", 4, 5, 6, "ellipsis", 12]. Keeps the
 * first/last page plus a window around the active page so the control never
 * grows unbounded.
 */
function getPageItems(current: number, total: number): Array<number | "ellipsis"> {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const items: Array<number | "ellipsis"> = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) items.push("ellipsis");
    for (let page = start; page <= end; page++) items.push(page);
    if (end < total - 1) items.push("ellipsis");

    items.push(total);
    return items;
}

/** Walks up the DOM to find the closest vertically-scrollable ancestor. */
function getScrollableParent(node: HTMLElement | null): HTMLElement | null {
    let el = node?.parentElement ?? null;
    while (el) {
        const overflowY = getComputedStyle(el).overflowY;
        if (
            (overflowY === "auto" || overflowY === "scroll") &&
            el.scrollHeight > el.clientHeight
        ) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

/**
 * Pretty, RTL-aware, reusable pagination control built on the shadcn
 * pagination primitives.
 *
 * Defaults to URL-driven navigation (server-side pagination) and scrolls the
 * surrounding content area — not the window — back to the top on each change.
 */
export function DataPagination({
    currentPage,
    totalPages,
    onPageChange,
    pageParam = "page",
    scrollContentToTop = true,
    className,
}: DataPaginationProps): React.JSX.Element | null {
    const t = useTranslations("pagination");
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const rootRef = useRef<HTMLDivElement>(null);
    const previousPage = useRef(currentPage);

    // Scroll the content container (not the window) to the top on page change.
    useEffect(() => {
        if (!scrollContentToTop) return;
        if (previousPage.current === currentPage) return;
        previousPage.current = currentPage;
        getScrollableParent(rootRef.current)?.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage, scrollContentToTop]);

    const hrefFor = useCallback(
        (page: number): string => {
            const params = new URLSearchParams(searchParams.toString());
            if (page <= 1) {
                params.delete(pageParam);
            } else {
                params.set(pageParam, String(page));
            }
            const query = params.toString();
            return query ? `${pathname}?${query}` : pathname;
        },
        [pathname, searchParams, pageParam]
    );

    if (totalPages <= 1) return null;

    const isFirst = currentPage <= 1;
    const isLast = currentPage >= totalPages;

    /** Renders a page target as a Link (URL mode) or a button (controlled mode). */
    const renderTarget = (
        page: number,
        opts: {
            isActive?: boolean;
            disabled?: boolean;
            ariaLabel: string;
            children: React.ReactNode;
        }
    ): React.JSX.Element => {
        const sharedProps = {
            isActive: opts.isActive,
            disabled: opts.disabled,
            "aria-label": opts.ariaLabel,
        };

        if (onPageChange) {
            return (
                <PaginationLink asChild {...sharedProps}>
                    <button
                        type="button"
                        disabled={opts.disabled}
                        onClick={() => !opts.disabled && onPageChange(page)}
                    >
                        {opts.children}
                    </button>
                </PaginationLink>
            );
        }

        // A disabled prev/next isn't a navigable target — render a non-interactive anchor.
        if (opts.disabled) {
            return <PaginationLink {...sharedProps}>{opts.children}</PaginationLink>;
        }

        return (
            <PaginationLink asChild {...sharedProps}>
                <Link href={hrefFor(page)} scroll={false}>
                    {opts.children}
                </Link>
            </PaginationLink>
        );
    };

    return (
        <div ref={rootRef} className={cn("relative flex w-full flex-col items-center gap-[0.75rem]", className)}>
            <Pagination aria-label={t("label")}>
                <PaginationContent>
                    <PaginationItem>
                        {renderTarget(currentPage - 1, {
                            disabled: isFirst,
                            ariaLabel: t("previous"),
                            children: (
                                <ChevronLeft aria-hidden="true" className="w-[1rem] h-[1rem] rtl:rotate-180" />
                            ),
                        })}
                    </PaginationItem>

                    {getPageItems(currentPage, totalPages).map((item, index) =>
                        item === "ellipsis" ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={item}>
                                {renderTarget(item, {
                                    isActive: item === currentPage,
                                    ariaLabel: t("goToPage", { page: item }),
                                    children: item,
                                })}
                            </PaginationItem>
                        )
                    )}

                    <PaginationItem>
                        {renderTarget(currentPage + 1, {
                            disabled: isLast,
                            ariaLabel: t("next"),
                            children: (
                                <ChevronRight aria-hidden="true" className="w-[1rem] h-[1rem] rtl:rotate-180" />
                            ),
                        })}
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <p className="text-[0.625rem] font-bold tracking-wider uppercase text-muted-foreground/60 sm:absolute ltr:sm:right-0 rtl:sm:left-0 sm:top-1/2 sm:-translate-y-1/2">
                {t("pageInfo", { current: currentPage, total: totalPages })}
            </p>
        </div>
    );
}

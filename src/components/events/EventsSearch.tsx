"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EventsSearchProps {
    /** Current query value from the URL — the server-rendered source of truth. */
    initialQuery: string;
    /** Query-string key used to drive the server search. Defaults to "q". */
    queryParam?: string;
    className?: string;
}

/** How long to wait after the last keystroke before writing the URL. */
const DEBOUNCE_MS = 350;

/**
 * RTL-aware, debounced search field for the events page.
 *
 * Treats the URL `?q=` param as the source of truth: typing debounces a
 * `router.replace` so server-side filtering re-runs, and any new search resets
 * pagination back to the first page. A `useTransition` keeps the input snappy
 * and surfaces a subtle spinner while the server response is in flight.
 */
export default function EventsSearch({
    initialQuery,
    queryParam = "q",
    className,
}: EventsSearchProps): React.JSX.Element {
    const t = useTranslations("events.search");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [value, setValue] = useState(initialQuery);
    const [isPending, startTransition] = useTransition();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Re-sync local state when the URL changes externally (back/forward, clear).
    useEffect(() => {
        setValue(initialQuery);
    }, [initialQuery]);

    const commit = useCallback(
        (next: string): void => {
            const params = new URLSearchParams(searchParams.toString());
            const trimmed = next.trim();

            if (trimmed) {
                params.set(queryParam, trimmed);
            } else {
                params.delete(queryParam);
            }
            // A new search always starts from the first page of results.
            params.delete("page");

            const queryString = params.toString();
            startTransition(() => {
                router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
                    scroll: false,
                });
            });
        },
        [router, pathname, searchParams, queryParam]
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const next = event.target.value;
        setValue(next);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => commit(next), DEBOUNCE_MS);
    };

    const handleClear = (): void => {
        setValue("");
        if (debounceRef.current) clearTimeout(debounceRef.current);
        commit("");
    };

    // Commit immediately on Enter, skipping the debounce.
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (debounceRef.current) clearTimeout(debounceRef.current);
            commit(value);
        }
    };

    useEffect(
        () => () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        },
        []
    );

    const showClear = value.length > 0;

    return (
        <div className={cn("relative group/search", className)}>
            <Input
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={t("placeholder")}
                aria-label={t("label")}
                className="peer h-12 rounded-xl border-border/60 bg-background/60 ps-10 pe-10 shadow-sm backdrop-blur-xl transition-colors placeholder:text-muted-foreground/50 hover:border-border hover:bg-background/80 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:ring-offset-0 focus:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
            />
            <Search
                aria-hidden="true"
                className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60 transition-colors peer-focus:text-primary group-hover/search:text-muted-foreground"
            />
            <div className="absolute end-3.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                {isPending ? (
                    <Loader2
                        aria-hidden="true"
                        className="size-4 animate-spin text-muted-foreground"
                    />
                ) : showClear ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label={t("clear")}
                        className="flex size-5 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <X aria-hidden="true" className="size-3.5" />
                    </button>
                ) : null}
            </div>
        </div>
    );
}

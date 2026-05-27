import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">): React.JSX.Element {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
            {...props}
        />
    );
}
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn(
            // Borderless glass pill container with custom rem padding and spacing
            "flex items-center gap-[0.5rem] rounded-full bg-secondary/50 p-[0.25rem] shadow-sm backdrop-blur-md dark:bg-white/[0.04]",
            className
        )}
        {...props}
    />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
    ({ className, ...props }, ref) => (
        <li ref={ref} className={cn("", className)} {...props} />
    )
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
    isActive?: boolean;
    disabled?: boolean;
    asChild?: boolean;
} & React.ComponentProps<"a">;

function PaginationLink({
    className,
    isActive,
    disabled,
    asChild,
    ...props
}: PaginationLinkProps): React.JSX.Element {
    const Comp = asChild ? Slot : "a";
    return (
        <Comp
            aria-current={isActive ? "page" : undefined}
            aria-disabled={disabled || undefined}
            data-active={isActive ? "" : undefined}
            className={cn(
                "flex w-[2rem] h-[2rem] select-none items-center justify-center rounded-full text-[0.75rem] font-bold outline-none transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background active:scale-95",
                isActive
                    ? "scale-105 bg-gradient-to-r from-primary to-indigo-500 text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)] ring-1 ring-primary/20"
                    : "text-muted-foreground/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground hover:scale-105",
                disabled && "pointer-events-none opacity-20",
                className
            )}
            {...props}
        />
    );
}
PaginationLink.displayName = "PaginationLink";

function PaginationPrevious({
    className,
    children,
    ...props
}: PaginationLinkProps): React.JSX.Element {
    return (
        <PaginationLink className={cn("text-muted-foreground", className)} {...props}>
            <ChevronLeft aria-hidden="true" className="w-[1rem] h-[1rem] rtl:rotate-180" />
            {children}
        </PaginationLink>
    );
}
PaginationPrevious.displayName = "PaginationPrevious";

function PaginationNext({
    className,
    children,
    ...props
}: PaginationLinkProps): React.JSX.Element {
    return (
        <PaginationLink className={cn("text-muted-foreground", className)} {...props}>
            {children}
            <ChevronRight aria-hidden="true" className="w-[1rem] h-[1rem] rtl:rotate-180" />
        </PaginationLink>
    );
}
PaginationNext.displayName = "PaginationNext";

function PaginationEllipsis({
    className,
    ...props
}: React.ComponentProps<"span">): React.JSX.Element {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "flex w-[2rem] h-[2rem] items-center justify-center text-muted-foreground",
                className
            )}
            {...props}
        >
            <MoreHorizontal className="w-[1rem] h-[1rem]" />
        </span>
    );
}
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
};

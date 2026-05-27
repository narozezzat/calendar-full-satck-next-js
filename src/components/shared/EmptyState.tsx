import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateAction {
  /** Localized navigation target (i18n `Link` href). */
  href: React.ComponentProps<typeof Link>["href"];
  /** Button label. */
  label: string;
  /** Optional leading icon for the button. */
  icon?: LucideIcon;
  /** Button visual style. Defaults to the solid primary button. */
  variant?: React.ComponentProps<typeof Button>["variant"];
}

interface EmptyStateProps {
  /** Large icon shown in the central badge. */
  icon: LucideIcon;
  /** Optional small icon overlaid as a corner badge (e.g. a "+" affordance). */
  badgeIcon?: LucideIcon;
  title: string;
  description: string;
  /** Optional call-to-action button. */
  action?: EmptyStateAction;
  /**
   * Accent of the icon badge. `primary` (default) for inviting/first-run
   * states, `muted` for neutral states such as "no search results".
   */
  tone?: "primary" | "muted";
  className?: string;
}

/**
 * Reusable, RTL-aware glass empty-state card with a glowing backdrop, an icon
 * badge, title/description, and an optional call-to-action. Covers both
 * first-run ("nothing created yet") and result-less ("no matches") states.
 */
export default function EmptyState({
  icon: Icon,
  badgeIcon: BadgeIcon,
  title,
  description,
  action,
  tone = "primary",
  className,
}: EmptyStateProps): React.JSX.Element {
  const ActionIcon = action?.icon;

  return (
    <div className={cn("py-12 flex justify-center", className)}>
      <div className="w-full max-w-lg glass-card border-dashed border-2 border-border/60 rounded-2xl p-10 text-center flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Glowing backdrop decorators */}
        <div className="absolute -top-12 -start-12 w-28 h-28 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute -bottom-12 -end-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl" />

        {/* Icon badge */}
        <div
          className={cn(
            "p-4.5 rounded-full border shadow-sm relative",
            tone === "primary"
              ? "bg-primary/10 border-primary/25 text-primary shadow-primary/10"
              : "bg-secondary/70 border-border/50 text-muted-foreground",
          )}
        >
          <Icon aria-hidden="true" className="size-10" />
          {BadgeIcon ? (
            <div className="absolute -top-1 -end-1 bg-primary text-primary-foreground p-1 rounded-full border-2 border-background">
              <BadgeIcon aria-hidden="true" className="size-3" />
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {action ? (
          <Button
            size="lg"
            variant={action.variant}
            className={cn(
              "font-semibold mt-2",
              action.variant == null && "shadow-lg shadow-primary/20",
            )}
            asChild
          >
            <Link href={action.href} className="flex items-center gap-2">
              {ActionIcon ? (
                <ActionIcon aria-hidden="true" className="size-5" />
              ) : null}
              <span>{action.label}</span>
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

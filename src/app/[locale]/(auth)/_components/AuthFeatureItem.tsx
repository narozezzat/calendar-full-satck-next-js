import * as React from "react";
import { type LucideIcon } from "lucide-react";

interface AuthFeatureItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** A single icon + title + description row in the auth branding feature list. */
export function AuthFeatureItem({
  icon: Icon,
  title,
  description,
}: AuthFeatureItemProps): React.JSX.Element {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 p-1 rounded text-primary mt-0.5 border border-primary/20">
        <Icon aria-hidden="true" className="size-4" />
      </div>
      <div>
        <p className="font-semibold text-foreground text-sm">{title}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{description}</p>
      </div>
    </div>
  );
}

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyEventButton } from "@/components/CopyEventButton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatEventDescription } from "@/lib/formatters";
import { EventCardProps } from "@/types/eventTypes";
import { Clock, EyeOff, Edit, ExternalLink } from "lucide-react";
import * as React from "react";

export default function EventCard({
    id,
    isActive,
    name,
    description,
    durationInMinutes,
    clerkUserId,
}: EventCardProps): React.JSX.Element {
    return (
        <Card className={cn(
            "flex flex-col glass-card hover-card-glow relative group overflow-hidden",
            !isActive && "border-secondary/30 opacity-75 hover:opacity-100"
        )}>
            {/* Pulsing indicator or inactive indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                {isActive ? (
                    <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded border border-border/40">
                        <EyeOff aria-hidden="true" className="size-3" /> Inactive
                    </span>
                )}
            </div>

            <CardHeader className="pb-3 pr-20">
                <CardTitle className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {name}
                </CardTitle>
                <div className="flex items-center gap-1.5 mt-2 w-fit bg-primary/10 border border-primary/20 text-primary rounded-full px-3 py-0.5 text-xs font-semibold">
                    <Clock aria-hidden="true" className="size-3.5" />
                    <span>{formatEventDescription(durationInMinutes)}</span>
                </div>
            </CardHeader>

            {description != null ? (
                <CardContent className="text-sm text-muted-foreground flex-1 min-h-[60px] line-clamp-3 pb-4">
                    {description}
                </CardContent>
            ) : null}

            <CardFooter className="flex justify-end gap-2.5 pt-4 mt-auto border-t border-border/40 bg-secondary/10">
                {isActive ? (
                    <>
                        <CopyEventButton
                            variant="outline"
                            size="sm"
                            eventId={id}
                            clerkUserId={clerkUserId}
                            className="text-xs h-9 bg-background/50 border-border/50 hover:bg-primary/5 hover:text-primary transition-all"
                        />
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="text-xs h-9 bg-background/50 border-border/50 hover:bg-primary/5 hover:text-primary transition-all"
                        >
                            <Link
                                href={`/book/${clerkUserId}/${id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5"
                            >
                                <ExternalLink aria-hidden="true" className="size-3.5" />
                                <span>Preview</span>
                            </Link>
                        </Button>
                    </>
                ) : null}
                <Button size="sm" asChild className="h-9 text-xs font-semibold shadow-sm">
                    <Link href={`/events/${id}/edit`} className="flex items-center gap-1.5">
                        <Edit aria-hidden="true" className="size-3.5" /> Edit
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
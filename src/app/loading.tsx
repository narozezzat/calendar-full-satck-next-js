import { Loader2 } from "lucide-react";
import * as React from "react";

export default function RootLoading(): React.JSX.Element {
    return (
        <div className="flex-1 flex flex-col gap-6 items-center justify-center min-h-[75vh] w-full text-center px-4">
            {/* Spinning Loader Container with a subtle glow */}
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                <Loader2 className="relative text-primary size-14 animate-spin stroke-[2]" />
            </div>
            
            {/* Loading text with gradient & styling */}
            <div className="space-y-1.5 z-10">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 tracking-tight">
                    Loading Page
                </h2>
                <p className="text-xs text-muted-foreground font-medium animate-pulse tracking-wide uppercase">
                    Please wait...
                </p>
            </div>
        </div>
    );
}

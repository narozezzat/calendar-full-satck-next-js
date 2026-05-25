import { NavLink } from "@/components/NavLink";
import { UserButton } from "@clerk/nextjs";
import { CalendarRange } from "lucide-react";
import * as React from "react";
import { ReactNode } from "react";
import Link from "next/link";

export default function PrivateLayout({ children }: { children: ReactNode }): React.JSX.Element {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Glassmorphic Sticky Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="container flex h-16 items-center justify-between">
                    
                    {/* Brand / Logo */}
                    <Link href="/events" className="flex items-center gap-2.5 font-bold text-lg tracking-tight select-none">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary border border-primary/20 shadow-sm shadow-primary/10">
                            <CalendarRange aria-hidden="true" className="size-5" />
                        </div>
                        <span className="sr-only md:not-sr-only text-foreground">Calendar</span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-2 font-medium">
                        <NavLink href="/events">Events</NavLink>
                        <NavLink href="/schedule">Schedule</NavLink>
                    </nav>

                    {/* Profile Button */}
                    <div className="flex items-center gap-4">
                        <div className="size-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all overflow-hidden flex items-center justify-center">
                            <UserButton 
                                appearance={{ 
                                    elements: { 
                                        userButtonAvatarBox: "size-full",
                                        userButtonTrigger: "focus:shadow-none focus:outline-none"
                                    } 
                                }} 
                            />
                        </div>
                    </div>

                </div>
            </header>

            {/* Main Content Area */}
            <main className="container flex-1 my-8 relative z-10">
                <div className="animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    )
}
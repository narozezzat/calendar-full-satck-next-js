import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import * as React from "react";
import { ReactNode } from "react";
import { CalendarRange, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }): React.JSX.Element {
  const { userId } = auth();
  if (userId != null) redirect("/");

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Left Pane: Branding & Features (hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-secondary/10 border-r border-border/40 relative z-10">
        
        {/* Logo / Header */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground select-none w-fit">
          <div className="bg-primary/10 p-2 rounded-lg text-primary border border-primary/20 shadow-sm shadow-primary/10">
            <CalendarRange aria-hidden="true" className="size-5" />
          </div>
          <span>Evently</span>
        </Link>

        {/* Dynamic Content */}
        <div className="space-y-8 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary w-fit">
            <Sparkles aria-hidden="true" className="size-3 h-3" />
            <span>Secure Access Control</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground leading-[1.25]">
            Manage your schedule like a <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">pro developer</span>.
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1 rounded text-primary mt-0.5 border border-primary/20">
                <CheckCircle2 aria-hidden="true" className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Flexible Calendar Availability</p>
                <p className="text-muted-foreground text-xs mt-0.5">Customize daily time slots, active hours, and exception dates.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1 rounded text-primary mt-0.5 border border-primary/20">
                <Zap aria-hidden="true" className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Instant Timezone Calculations</p>
                <p className="text-muted-foreground text-xs mt-0.5">Never double-book or confuse zone differences with international guests.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1 rounded text-primary mt-0.5 border border-primary/20">
                <ShieldCheck aria-hidden="true" className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Automated Booking Links</p>
                <p className="text-muted-foreground text-xs mt-0.5">Send links to schedule meetings. We take care of confirmation emails.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-muted-foreground">
          Protected by Evently Security Services.
        </div>
      </div>

      {/* Right Pane: Clerk Widget (always visible) */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 relative z-10">
        {/* Small header logo for mobile */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <CalendarRange aria-hidden="true" className="size-5 text-primary" />
            <span>Evently</span>
          </Link>
        </div>

        <div className="w-full max-w-md flex justify-center scale-95 md:scale-100 transition-transform">
          {children}
        </div>
      </div>

    </div>
  );
}
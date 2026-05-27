import { auth } from "@clerk/nextjs/server";
import { redirect } from "@/i18n/routing";
import * as React from "react";
import { ReactNode } from "react";
import { CalendarRange } from "lucide-react";
import { Link } from "@/i18n/routing";
import { LocaleThemeControls } from "@/components/layout/LocaleThemeControls";
import { getTranslations, getLocale } from "next-intl/server";
import { AuthBrandingPane } from "./_components/AuthBrandingPane";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}): Promise<React.JSX.Element> {
  const { userId } = auth();
  if (userId != null) {
    const locale = await getLocale();
    redirect({ href: "/", locale });
  }

  const tc = await getTranslations("common");

  return (
    <div className="flex-1 overflow-y-auto w-full grid grid-cols-1 lg:grid-cols-12 relative">
      {/* Theme Toggle & Language Switcher */}
      <div className="absolute top-4 end-4 z-50 flex items-center gap-2">
        <LocaleThemeControls />
      </div>

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] start-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Left Pane: Branding & Features (hidden on mobile/tablet) */}
      <AuthBrandingPane />

      {/* Right Pane: Clerk Widget (always visible) */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 relative z-10">
        {/* Small header logo for mobile */}
        <div className="lg:hidden mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-foreground"
          >
            <CalendarRange aria-hidden="true" className="size-5 text-primary" />
            <span>{tc("appName")}</span>
          </Link>
        </div>

        <div className="w-full max-w-md flex justify-center scale-95 md:scale-100 transition-transform">
          {children}
        </div>
      </div>
    </div>
  );
}

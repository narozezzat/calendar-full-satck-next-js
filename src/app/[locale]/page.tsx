import * as React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import { LandingHeader } from "./_components/landing/LandingHeader";
import { LandingHero } from "./_components/landing/LandingHero";
import { LandingMockup } from "./_components/landing/LandingMockup";
import { LandingFooter } from "./_components/landing/LandingFooter";

export default async function HomePage(): Promise<React.JSX.Element> {
  const { userId } = auth();
  if (userId != null) {
    const locale = await getLocale();
    redirect({ href: "/events", locale });
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <LandingHeader />

      {/* Scrollable Content Wrapper */}
      <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar">
        {/* Hero Section */}
        <main className="flex-1 lg:flex lg:items-center">
          <div className="container py-12 md:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <LandingHero />
            <LandingMockup />
          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}

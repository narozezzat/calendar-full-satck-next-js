"use client";

import { PageLoader } from "@/components/PageLoader";
import { useTranslations } from "next-intl";
import * as React from "react";

export default function Loading(): React.JSX.Element {
    const t = useTranslations("common");
    return <PageLoader label={t("loadingEvent")} />;
}

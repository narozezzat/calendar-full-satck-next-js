"use client";

import { PageLoader } from "@/components/shared/PageLoader";
import { useTranslations } from "next-intl";
import * as React from "react";

export default function EditEventLoading(): React.JSX.Element {
  const t = useTranslations("common");
  return <PageLoader label={t("openEventEditor")} minHeight="min-h-[50vh]" />;
}

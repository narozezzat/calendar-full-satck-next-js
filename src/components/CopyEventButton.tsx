"use client"

import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { CheckCheck, Copy, CopyX } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type CopyState = "idle" | "copied" | "error";

export function CopyEventButton({ eventId, clerkUserId, ...buttonProps }: Omit<ButtonProps,
    "children" | "onClick"> & { eventId: string; clerkUserId: string }) {

    const t = useTranslations("common")
    const [copyState, setCopyState] = useState<CopyState>("idle")

    const CopyIcon = getCopyIcon(copyState)
    const label = getChildren(copyState, t)
    return (
        <Button
            {...buttonProps}
            aria-label={label}
            onClick={() => {
                navigator.clipboard.writeText(`${location.origin}/book/${clerkUserId}/${eventId}`)
                    .then(() => {
                        setCopyState("copied")
                        toast.success(t("copied"))
                        setTimeout(() => setCopyState("idle"), 2000)
                    })
                    .catch(() => {
                        setCopyState("error")
                        toast.error(t("copyError"))
                        setTimeout(() => setCopyState("idle"), 2000)
                    })
            }}
        >
            <CopyIcon aria-hidden="true" className="size-4 sm:me-2" />
            <span className="hidden sm:inline">{label}</span>
        </Button>
    )
}

function getCopyIcon(state: CopyState) {
    switch (state) {
        case "idle":
            return Copy;
        case "copied":
            return CheckCheck;
        case "error":
            return CopyX;
    }
}

function getChildren(state: CopyState, t: ReturnType<typeof useTranslations<"common">>) {
    switch (state) {
        case "idle":
            return t("copyLink");
        case "copied":
            return t("copied");
        case "error":
            return t("copyError");
    }
}
"use client"

import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { CheckCheck, Copy, CopyX } from "lucide-react";

type CopyState = "idle" | "copied" | "error";

export function CopyEventButton({ eventId, clerkUserId, ...buttonProps }: Omit<ButtonProps,
    "children" | "onClick"> & { eventId: string; clerkUserId: string }) {

    const [copyState, setCopyState] = useState<CopyState>("idle")

    const CopyIcon = getCopyIcon(copyState)
    return (
        <Button {...buttonProps} onClick={() => {
            navigator.clipboard.writeText(`${location.origin}/book/${clerkUserId}/${eventId}`)
                .then(() => {
                    setCopyState("copied")
                    setTimeout(() => setCopyState("idle"), 2000)
                })
                .catch(() => {
                    setCopyState("error")
                    setTimeout(() => setCopyState("idle"), 2000)
                })

        }}>
            <CopyIcon className="size-4 mr-2" />
            {getChildren(copyState)}
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

function getChildren(state: CopyState) {
    switch (state) {
        case "idle":
            return "Copy Link";
        case "copied":
            return "Copied";
        case "error":
            return "Error";
    }
}
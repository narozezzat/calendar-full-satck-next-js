"use client";

import * as React from "react";
import { Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Disables the buttons and shows a spinner on confirm while the action runs. */
  isPending?: boolean;
  /** Invoked when the user confirms the deletion. */
  onConfirm: () => void;
  /**
   * Forwarded to the dialog content. Used by callers that chain a success
   * dialog open once this one finishes its close animation.
   */
  onCloseAutoFocus?: (event: Event) => void;
}

/**
 * Consistent destructive confirmation dialog: a Trash icon title, a
 * description, and Cancel / Delete actions with an inline pending spinner.
 * Controlled via `open` / `onOpenChange`. Shared across single, bulk, and
 * in-form delete flows.
 */
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isPending = false,
  onConfirm,
  onCloseAutoFocus,
}: DeleteConfirmDialogProps): React.JSX.Element {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="glass-card border-border/60"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="size-5" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            disabled={isPending}
            className="border-border/50 hover:bg-secondary/50"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            {isPending ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : null}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useTransition, useState } from "react";
import { deleteEvent } from "@/server/actions/events";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SuccessDialog } from "@/components/shared/SuccessDialog";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";

interface DeleteEventButtonProps {
  id: string;
  className?: string;
}

export function DeleteEventButton({ id, className }: DeleteEventButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [shouldOpenSuccess, setShouldOpenSuccess] = useState(false);

  const t = useTranslations("eventForm");
  const router = useRouter();

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "size-9 bg-background/50 border-destructive/30 text-destructive/80 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive shadow-sm transition-all",
              className,
            )}
            disabled={isPending}
            aria-label={t("deleteButton")}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          className="glass-card border-border/60"
          onCloseAutoFocus={(e) => {
            if (shouldOpenSuccess) {
              e.preventDefault();
              setShouldOpenSuccess(false);
              setShowSuccessDialog(true);
            }
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="size-5" />
              {t("deleteTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-border/50 hover:bg-secondary/50">
              {t("cancelButton")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20"
              onClick={(e) => {
                e.preventDefault();
                startTransition(async () => {
                  const res = await deleteEvent(id);
                  if (!res.error) {
                    setShouldOpenSuccess(true);
                    setShowDeleteDialog(false);
                  }
                });
              }}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("deleteConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title={t("deleteSuccessTitle")}
        description={t("deleteSuccessMessage")}
        onContinue={() => router.refresh()}
      />
    </>
  );
}

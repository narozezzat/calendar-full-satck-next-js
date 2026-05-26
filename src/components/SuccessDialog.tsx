"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  continueLabel?: string;
  onContinue?: () => void;
}

export function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  continueLabel,
  onContinue,
}: SuccessDialogProps) {
  const t = useTranslations("common");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card border-border/60 sm:max-w-sm overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-10 -inset-x-10 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"
        />

        <AlertDialogHeader className="flex flex-col items-center text-center sm:text-center space-y-4 pt-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
            <div className="relative w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <div className="space-y-1.5 relative z-10">
            <AlertDialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[15px] text-muted-foreground leading-relaxed">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex justify-center sm:justify-center w-full">
          <AlertDialogAction
            onClick={() => {
              onOpenChange(false);
              onContinue?.();
            }}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
          >
            {continueLabel ?? t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

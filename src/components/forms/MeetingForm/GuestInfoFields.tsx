import * as React from "react";
import { type Control } from "react-hook-form";
import { z } from "zod";
import { User, Mail, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { meetingFormSchema } from "@/schema/meetings";

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

interface GuestInfoFieldsProps {
    control: Control<MeetingFormValues>;
}

const inputClassName =
    "h-10 bg-background/50 border-input hover:border-muted-foreground/40 focus-visible:ring-primary/20 focus-visible:border-primary";

/** Guest name, email and notes fields for the meeting booking form. */
export function GuestInfoFields({ control }: GuestInfoFieldsProps): React.JSX.Element {
    const t = useTranslations("meetingForm");
    return (
        <div className="space-y-4 pt-4 border-t border-border/40">
            <FormLabel className="text-sm font-bold text-foreground">{t("guestInfoLabel")}</FormLabel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="guestName"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <User aria-hidden="true" className="size-3.5" />
                                <span>{t("nameLabel")}</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("namePlaceholder")}
                                    className={inputClassName}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="guestEmail"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <Mail aria-hidden="true" className="size-3.5" />
                                <span>{t("emailLabel")}</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder={t("emailPlaceholder")}
                                    className={inputClassName}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="guestNotes"
                render={({ field }) => (
                    <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                            <FileText aria-hidden="true" className="size-3.5" />
                            <span>{t("notesLabel")}</span>
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder={t("notesPlaceholder")}
                                className="resize-none h-24 bg-background/50 border-input hover:border-muted-foreground/40 focus-visible:ring-primary/20 focus-visible:border-primary"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

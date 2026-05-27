"use client"

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventFormSchema } from "@/schema/events";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useRouter } from "@/i18n/routing";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events";
import * as React from "react";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SuccessDialog } from "@/components/SuccessDialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { FormRootError } from "./fields/FormRootError";

export function EventForm({ event }: {
    event?: {
        id: string;
        name: string;
        description?: string;
        isActive: boolean;
        durationInMinutes: number;
    }
}): React.JSX.Element {
    const t = useTranslations("eventForm")
    const router = useRouter()
    const [isDeletingPending, startDeleteTransition] = useTransition()
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
    const [showSuccessDialog, setShowSuccessDialog] = React.useState(false)
    const [shouldOpenSuccess, setShouldOpenSuccess] = React.useState(false)
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event
            ? { ...event, description: event.description ?? "" }
            : {
                  name: "",
                  description: "",
                  isActive: true,
                  durationInMinutes: 30,
              },
    })

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        const isUpdate = event != null
        const action = isUpdate ? updateEvent.bind(null, event.id) : createEvent
        const data = await action(values);

        if (data?.error) {
            const message = isUpdate ? t("errorUpdate") : t("errorCreate")
            toast.error(message)
            form.setError("root", { message })
        } else {
            toast.success(isUpdate ? t("updateSuccess") : t("createSuccess"))
            router.push("/events")
        }
    }

    function handleDelete() {
        if (event == null) return
        startDeleteTransition(async () => {
            const data = await deleteEvent(event.id)

            if (data?.error) {
                toast.error(t("errorDelete"))
                form.setError("root", { message: t("errorDelete") })
            } else {
                setShouldOpenSuccess(true);
                setShowDeleteDialog(false);
            }
        })
    }

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormRootError message={form.formState.errors.root?.message} />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-bold text-foreground">{t("nameLabel")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("namePlaceholder")}
                                        className="h-10 border-input bg-background/50 hover:border-muted-foreground/40 focus-visible:ring-primary/20 focus-visible:border-primary"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs text-muted-foreground">
                                    {t("nameDescription")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="durationInMinutes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-bold text-foreground">{t("durationLabel")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        placeholder={t("durationPlaceholder")}
                                        className="h-10 border-input bg-background/50 hover:border-muted-foreground/40 focus-visible:ring-primary/20 focus-visible:border-primary"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs text-muted-foreground">
                                    {t("durationDescription")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-bold text-foreground">{t("descriptionLabel")}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={t("descriptionPlaceholder")}
                                        className="resize-none h-28 border-input bg-background/50 hover:border-muted-foreground/40 focus-visible:ring-primary/20 focus-visible:border-primary"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs text-muted-foreground">
                                    {t("descriptionDescription")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="bg-secondary/20 rounded-xl p-4 border border-border/40">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5 pe-4">
                                        <FormLabel className="text-sm font-bold text-foreground">{t("activeLabel")}</FormLabel>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            {t("activeDescription")}
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between pt-4 border-t border-border/40 gap-3">
                        <div>
                            {event ? (
                                <Button
                                    variant="destructiveGhost"
                                    type="button"
                                    disabled={isDeletingPending || form.formState.isSubmitting}
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="h-10 gap-1.5 font-semibold text-xs border border-destructive/20 hover:bg-destructive/10"
                                >
                                    <Trash2 aria-hidden="true" className="size-3.5" />
                                    {t("deleteButton")}
                                </Button>
                            ) : null}
                        </div>

                        <div className="flex gap-2">
                            <Button type="button" asChild variant="outline" className="h-10 text-xs font-semibold">
                                <Link href="/events">{t("cancelButton")}</Link>
                            </Button>
                            <Button
                                disabled={form.formState.isSubmitting || !form.formState.isDirty}
                                type="submit"
                                className="h-10 text-xs font-semibold shadow-lg shadow-primary/10"
                            >
                                {form.formState.isSubmitting ? t("saving") : t("saveButton")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>

            {event ? (
                <DeleteConfirmDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                    title={t("deleteTitle")}
                    description={t("deleteDescription")}
                    confirmLabel={t("deleteConfirm")}
                    cancelLabel={t("cancelButton")}
                    isPending={isDeletingPending || form.formState.isSubmitting}
                    onConfirm={handleDelete}
                    onCloseAutoFocus={(e) => {
                        if (shouldOpenSuccess) {
                            e.preventDefault();
                            setShouldOpenSuccess(false);
                            setShowSuccessDialog(true);
                        }
                    }}
                />
            ) : null}

            <SuccessDialog
                open={showSuccessDialog}
                onOpenChange={setShowSuccessDialog}
                title={t("deleteSuccessTitle")}
                description={t("deleteSuccessMessage")}
                onContinue={() => router.push("/events")}
            />
        </>
    )
}

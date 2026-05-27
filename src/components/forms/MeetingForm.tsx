"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Link } from "@/i18n/routing"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import {
    formatDate,
    formatTimeString,
    formatTimezoneOffset,
} from "@/lib/formatters"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon, Clock, Globe, User, Mail, FileText, CheckCircle2 } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import * as React from "react"
import { useMemo } from "react"
import { toZonedTime } from "date-fns-tz"
import { createMeeting } from "@/server/actions/meetings"
import { meetingFormSchema } from "@/schema/meetings"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export function MeetingForm({
    validTimes,
    eventId,
    clerkUserId,
}: {
    validTimes: Date[]
    eventId: string
    clerkUserId: string
}): React.JSX.Element {
    const t = useTranslations("meetingForm")
    const form = useForm<z.infer<typeof meetingFormSchema>>({
        resolver: zodResolver(meetingFormSchema),
        defaultValues: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
    })

    const timezone = form.watch("timezone")
    const date = form.watch("date")
    const validTimesInTimezone = useMemo(() => {
        return validTimes.map(date => toZonedTime(date, timezone))
    }, [validTimes, timezone])

    async function onSubmit(values: z.infer<typeof meetingFormSchema>) {
        const data = await createMeeting({
            ...values,
            eventId,
            clerkUserId,
        })

        if (data?.error) {
            toast.error(t("errorMessage"))
            form.setError("root", {
                message: t("errorMessage"),
            })
        }
    }

    // Filter available slots for the selected day
    const availableSlotsForDay = useMemo(() => {
        if (!date) return [];
        return validTimesInTimezone.filter(time => isSameDay(time, date));
    }, [validTimesInTimezone, date]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                {form.formState.errors.root ? (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3.5 font-medium">
                        {form.formState.errors.root.message}
                    </div>
                ) : null}

                {/* Timezone Select */}
                <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                <Globe aria-hidden="true" className="size-4 text-muted-foreground" />
                                <span>{t("timezoneLabel")}</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-10 bg-background/50 border-input hover:border-muted-foreground/40 focus:ring-primary/30">
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[15.625rem] glass-card">
                                    {Intl.supportedValuesOf("timeZone").map(tz => (
                                        <SelectItem key={tz} value={tz} className="text-sm">
                                            {tz}
                                            {` (${formatTimezoneOffset(tz)})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Date and Time Selector (Interactive Side-by-side or stacked layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-border/40">
                    
                    {/* Date Picker Component */}
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <Popover>
                                <FormItem className="flex flex-col space-y-1.5">
                                    <FormLabel className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                        <CalendarIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                                        <span>{t("dateLabel")}</span>
                                    </FormLabel>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "h-10 ps-3 text-start font-normal flex w-full bg-background/50 border-input hover:border-muted-foreground/40 hover:bg-secondary/40",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate(field.value)
                                                ) : (
                                                    <span>{t("datePlaceholder")}</span>
                                                )}
                                                <CalendarIcon aria-hidden="true" className="ms-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-border glass-card rounded-xl shadow-2xl" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(d) => {
                                                field.onChange(d);
                                                // Reset start time value when date changes to avoid mismatch
                                                form.resetField("startTime");
                                            }}
                                            disabled={d =>
                                                !validTimesInTimezone.some(time =>
                                                    isSameDay(d, time)
                                                )
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                    <FormMessage />
                                </FormItem>
                            </Popover>
                        )}
                    />

                    {/* Time Slot Picker Grid */}
                    <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-1.5">
                                <FormLabel className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                    <Clock aria-hidden="true" className="size-4 text-muted-foreground" />
                                    <span>{t("timeLabel")}</span>
                                </FormLabel>
                                <div className="min-h-[6.25rem] flex-1">
                                    {date == null ? (
                                        <div className="flex flex-col items-center justify-center h-full border border-dashed border-border rounded-xl p-4 text-center bg-secondary/10">
                                            <CalendarIcon aria-hidden="true" className="size-5 text-muted-foreground/60 mb-1.5" />
                                            <span className="text-xs text-muted-foreground font-semibold">{t("selectDateFirst")}</span>
                                        </div>
                                    ) : availableSlotsForDay.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full border border-dashed border-border rounded-xl p-4 text-center bg-secondary/10">
                                            <span className="text-xs text-muted-foreground font-semibold">{t("noSlots")}</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 max-h-[10.9375rem] overflow-y-auto pe-1">
                                            {availableSlotsForDay.map(time => {
                                                const isSelected = field.value?.toISOString() === time.toISOString();
                                                return (
                                                    <Button
                                                        key={time.toISOString()}
                                                        type="button"
                                                        variant={isSelected ? "default" : "outline"}
                                                        className={cn(
                                                            "h-9 text-xs font-semibold rounded-lg transition-all",
                                                            isSelected 
                                                                ? "shadow-md shadow-primary/20 scale-[1.02] bg-primary text-primary-foreground border-primary" 
                                                                : "bg-background/40 border-input hover:border-primary/50 text-foreground"
                                                        )}
                                                        onClick={() => field.onChange(time)}
                                                    >
                                                        {formatTimeString(time)}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Personal Information */}
                <div className="space-y-4 pt-4 border-t border-border/40">
                    <FormLabel className="text-sm font-bold text-foreground">{t("guestInfoLabel")}</FormLabel>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
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
                                            className="h-10 bg-background/50 border-input hover:border-muted-foreground/40 focus-visible:ring-primary/20 focus-visible:border-primary"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
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
                                            className="h-10 bg-background/50 border-input hover:border-muted-foreground/40 focus-visible:ring-primary/20 focus-visible:border-primary"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
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

                {/* Form Footer Action Buttons */}
                <div className="flex gap-2.5 justify-end pt-4 border-t border-border/40">
                    <Button
                        disabled={form.formState.isSubmitting}
                        type="button"
                        asChild
                        variant="outline"
                        className="h-10 text-xs font-semibold"
                    >
                        <Link href={`/book/${clerkUserId}`}>{t("cancelButton")}</Link>
                    </Button>
                    <Button 
                        disabled={form.formState.isSubmitting || !form.watch("startTime")} 
                        type="submit"
                        className="h-10 text-xs font-semibold shadow-lg shadow-primary/20 gap-1.5"
                    >
                        <CheckCircle2 aria-hidden="true" className="size-4" />
                        <span>{form.formState.isSubmitting ? t("submitting") : t("submitButton")}</span>
                    </Button>
                </div>
            </form>
        </Form>
    )
}
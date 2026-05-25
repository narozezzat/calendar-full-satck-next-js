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
import Link from "next/link"
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

export function MeetingForm({
    validTimes,
    eventId,
    clerkUserId,
}: {
    validTimes: Date[]
    eventId: string
    clerkUserId: string
}): React.JSX.Element {
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
            form.setError("root", {
                message: "There was an error saving your event",
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
                                <span>Your Timezone</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-10 bg-background/50 border-border/60 focus:ring-primary/30">
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[250px] glass-card">
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
                                        <span>Meeting Date</span>
                                    </FormLabel>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "h-10 pl-3 text-left font-normal flex w-full bg-background/50 border-border/60 hover:bg-secondary/40",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate(field.value)
                                                ) : (
                                                    <span>Select a date</span>
                                                )}
                                                <CalendarIcon aria-hidden="true" className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-border/50 glass-card rounded-xl shadow-2xl" align="start">
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
                                    <span>Time Slot</span>
                                </FormLabel>
                                <div className="min-h-[100px] flex-1">
                                    {date == null ? (
                                        <div className="flex flex-col items-center justify-center h-full border border-dashed border-border/60 rounded-xl p-4 text-center bg-secondary/10">
                                            <CalendarIcon aria-hidden="true" className="size-5 text-muted-foreground/60 mb-1.5" />
                                            <span className="text-xs text-muted-foreground font-semibold">Select a date first</span>
                                        </div>
                                    ) : availableSlotsForDay.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full border border-dashed border-border/60 rounded-xl p-4 text-center bg-secondary/10">
                                            <span className="text-xs text-muted-foreground font-semibold">No available slots</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 max-h-[175px] overflow-y-auto pr-1">
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
                                                                : "bg-background/40 hover:bg-primary/5 hover:border-primary/50 text-foreground"
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
                    <FormLabel className="text-sm font-bold text-foreground">Guest Information</FormLabel>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="guestName"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                        <User aria-hidden="true" className="size-3.5" />
                                        <span>Full Name</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Your Name" 
                                            className="h-10 bg-background/50 border-border/60 focus-visible:ring-primary/20 focus-visible:border-primary"
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
                                        <span>Email Address</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="email" 
                                            placeholder="you@example.com" 
                                            className="h-10 bg-background/50 border-border/60 focus-visible:ring-primary/20 focus-visible:border-primary"
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
                                    <span>Notes (optional)</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea 
                                        placeholder="Add details, topics, or requests..." 
                                        className="resize-none h-24 bg-background/50 border-border/60 focus-visible:ring-primary/20 focus-visible:border-primary"
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
                        <Link href={`/book/${clerkUserId}`}>Cancel</Link>
                    </Button>
                    <Button 
                        disabled={form.formState.isSubmitting || !form.watch("startTime")} 
                        type="submit"
                        className="h-10 text-xs font-semibold shadow-lg shadow-primary/20 gap-1.5"
                    >
                        <CheckCircle2 aria-hidden="true" className="size-4" />
                        <span>{form.formState.isSubmitting ? "Scheduling..." : "Schedule Meeting"}</span>
                    </Button>
                </div>
            </form>
        </Form>
    )
}
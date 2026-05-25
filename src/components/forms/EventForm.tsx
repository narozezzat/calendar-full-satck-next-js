"use client"

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventFormSchema } from "@/schema/events";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events";
import * as React from "react";
import { useTransition } from "react";
import {
    AlertDialogHeader,
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogFooter,
    AlertDialogAction
} from "../ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { Trash2 } from "lucide-react";

export function EventForm({ event }: {
    event?: {
        id: string;
        name: string;
        description?: string;
        isActive: boolean;
        durationInMinutes: number;
    }
}): React.JSX.Element {
    const [isDeletingPending, startDeleteTransition] = useTransition()
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event ?? {
            isActive: true,
            durationInMinutes: 30
        },
    })

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        const action = event == null ? createEvent : updateEvent.bind(null, event.id)
        const data = await action(values);

        if (data?.error) {
            form.setError("root", {
                message: "Failed to create event",
                type: "error"
            })
        }
    }

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
                
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-bold text-foreground">Event Name</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="e.g., Intro Sync, Technical Interview" 
                                    className="h-10 border-input bg-background/50 hover:border-muted-foreground/40 focus-visible:ring-primary/20 focus-visible:border-primary"
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription className="text-xs text-muted-foreground">
                                The title attendees will see when booking this meeting.
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
                            <FormLabel className="text-sm font-bold text-foreground">Duration (minutes)</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    min={1}
                                    placeholder="30"
                                    className="h-10 border-input bg-background/50 hover:border-muted-foreground/40 focus-visible:ring-primary/20 focus-visible:border-primary"
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription className="text-xs text-muted-foreground">
                                The length of the booked time slot.
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
                            <FormLabel className="text-sm font-bold text-foreground">Description</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Write a brief overview of what this meeting is about..." 
                                    className="resize-none h-28 border-input bg-background/50 hover:border-muted-foreground/40 focus-visible:ring-primary/20 focus-visible:border-primary"
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription className="text-xs text-muted-foreground">
                                Optional instructions or notes for the guest.
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
                                <div className="space-y-0.5 pr-4">
                                    <FormLabel className="text-sm font-bold text-foreground">Active Status</FormLabel>
                                    <FormDescription className="text-xs text-muted-foreground">
                                        When active, guests can book slots using your public link.
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
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant="destructiveGhost" 
                                        type="button"
                                        disabled={isDeletingPending || form.formState.isSubmitting}
                                        className="h-10 gap-1.5 font-semibold text-xs border border-destructive/20 hover:bg-destructive/10"
                                    >
                                        <Trash2 aria-hidden="true" className="size-3.5" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="glass-card max-w-sm rounded-2xl border-border">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="font-bold text-lg">Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-sm text-muted-foreground">
                                            This action is permanent and cannot be undone. Guests will no longer be able to schedule slots for this event template.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="mt-4 gap-2">
                                        <AlertDialogCancel className="h-9 text-xs font-semibold px-4 border border-border/40 rounded-lg bg-background/50 hover:bg-secondary">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            disabled={isDeletingPending || form.formState.isSubmitting}
                                            variant="destructive"
                                            onClick={() => {
                                                startDeleteTransition(async () => {
                                                    const data = await deleteEvent(event.id)

                                                    if (data?.error) {
                                                        form.setError("root", {
                                                            message: "Failed to delete the event.",
                                                        })
                                                    }
                                                })
                                            }}
                                            className="h-9 text-xs font-semibold px-4 rounded-lg shadow-sm"
                                        >
                                            Delete Event
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        ) : null}
                    </div>

                    <div className="flex gap-2">
                        <Button type="button" asChild variant="outline" className="h-10 text-xs font-semibold">
                            <Link href="/events">Cancel</Link>
                        </Button>
                        <Button 
                            disabled={form.formState.isSubmitting} 
                            type="submit" 
                            className="h-10 text-xs font-semibold shadow-lg shadow-primary/10"
                        >
                            {form.formState.isSubmitting ? "Saving..." : "Save Event"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
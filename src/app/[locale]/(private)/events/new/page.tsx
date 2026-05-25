import { EventForm } from "@/components/forms/EventForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"

export default async function NewEventPage() {
    const t = await getTranslations("eventForm")

    return (
        <Card className="max-w-md mx-auto glass-card">
            <CardHeader>
                <CardTitle>{t("newTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
                <EventForm />
            </CardContent>
        </Card>
    )
}
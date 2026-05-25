import { PageLoader } from "@/components/PageLoader";
import * as React from "react";

export default function NewEventLoading(): React.JSX.Element {
    return <PageLoader label="Opening Event Creator" minHeight="min-h-[50vh]" />;
}

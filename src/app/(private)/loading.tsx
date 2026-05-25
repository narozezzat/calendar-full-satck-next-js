import { PageLoader } from "@/components/PageLoader";
import * as React from "react";

export default function PrivateLoading(): React.JSX.Element {
    return <PageLoader label="Loading Dashboard" minHeight="min-h-[60vh]" />;
}


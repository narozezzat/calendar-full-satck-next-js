import { PageLoader } from "@/components/PageLoader";
import * as React from "react";

export default function EditEventLoading(): React.JSX.Element {
    return <PageLoader label="Opening Event Editor" minHeight="min-h-[50vh]" />;
}

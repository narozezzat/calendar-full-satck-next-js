import { PageLoader } from "@/components/shared/PageLoader";
import * as React from "react";

export default function PrivateLoading(): React.JSX.Element {
  return <PageLoader minHeight="min-h-[60vh]" />;
}

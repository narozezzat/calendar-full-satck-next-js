import { ReactNode } from "react";
import * as React from "react";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden flex">
      <div className="container py-6 flex flex-col flex-1 min-h-full">
        {children}
      </div>
    </main>
  );
}

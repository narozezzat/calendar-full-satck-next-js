import type { Metadata } from "next";
import "./globals.css";
import * as React from "react";

export const metadata: Metadata = {
  title: "Evently",
  description: "Smart scheduling & event management",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return children as React.JSX.Element;
}

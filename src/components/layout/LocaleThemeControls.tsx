import * as React from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/**
 * The language switcher + theme toggle pair shown together in every layout
 * header. Renders the two controls only; callers provide their own wrapper
 * (positioning, spacing) around it.
 */
export function LocaleThemeControls(): React.JSX.Element {
  return (
    <>
      <LanguageSwitcher />
      <ThemeToggle />
    </>
  );
}
